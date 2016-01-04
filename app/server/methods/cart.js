(function () {
	Future = Npm.require('fibers/future');

	Meteor.methods({
	  addToCart: function add_to_cart(cartItem) {
	    //check if the item is already in the cart

	    var user = Meteor.user();

	    if (user && _.isArray(user.profile.cart)) {
	      var indx = user.profile.cart.findIndex(function(item) {
	        return ((cartItem.productId == item.productId) && cartItem.size == item.size);
	      })

	      if (indx > -1) {
	        return Meteor.users.update({
	          _id: Meteor.userId(),
	          'profile.cart.productId': cartItem.productId
	        }, {
	          $inc: {
	            'profile.cart.$.quantity': cartItem.quantity || 1
	          }
	        })
	      }
	    }

	    Meteor.users.update({
	      _id: Meteor.userId()
	    }, {
	      $push: {
	        'profile.cart': cartItem
	      }
	    });
	  },
	  removeFromCart: function remove_from_cart(id) {
	    //weird error where mongodb $pull won't work
	    //in meteor but will in console
	    //$pull : {'profile.cart': {id :id}}
	    var user = Meteor.user();

	    if (!user) {
	      throw new Meteor.Error('not-logged-in', 'the user is not logged in');
	    }

	    var cart = user.profile.cart;

	    var indx = cart.findIndex(function(item) {
	      return item.id == id;
	    })

	    cart.splice(indx, 1);

	    Meteor.users.update(Meteor.userId(), {
	      $set: {
	        'profile.cart': cart
	      }
	    });
	  },
	  createStripeCustomer : function create_stripe_customer(token, email) {
	  	var Stripe = StripeAPI('sk_mKLYgZGYkqjzg5DPyyc0u2hrYnhgR');
	  	var customer = new Future();

	  	Stripe.customers.create({
	  		source : token,
	  		email : email
	  	}, function (err, response) {
	  		if(err) {
	  			console.error('create customer err', err);
	  			customer.throw(new Meteor.Error('bad-customer', "couldn't create a new customer"));
	  		} else {
	  			customer.return(response);
	  		}
	  	});

	  	return customer.wait();
	  },
	  createStripeCharge : function create_stripe_charge(charge) {
	  	var Stripe = StripeAPI('sk_mKLYgZGYkqjzg5DPyyc0u2hrYnhgR');
	  	var finalCharge = new Future();

	  	Stripe.charges.create(charge, function (err, response) {
	  		if(err) {
	  			console.error(err);
	  			finalCharge.throw(new Meteor.Error('invalid-card-charge', "transaction failed"));
	  		} else {
	  			finalCharge.return(response);
	  		}
	  	})

	  	return finalCharge.wait();
	  },
	  checkout: function checkout(charity, billing, shipping, stripeToken, email) {
	    var Stripe = StripeAPI('sk_mKLYgZGYkqjzg5DPyyc0u2hrYnhgR');
	    var user = Meteor.user();
	    var cart = user.profile.cart;

	    try{
	    	console.log(arguments)
	    	//check all inputs before attempting charge
	    	check(billing, billingCheck());
	    	check(shipping,shippingCheck());
	    	check(charity, charityCheck());
	    	check({token : stripeToken}, {token : String});
	    	check({email : email}, {email : String});

	    	if (user)
	      email = user.emails[0].address

	    	//get the product ids and quantities
		    var productIdAndQuantity = getProductAndQuantity(cart);

		    //add up the total price of every item (including shipping)
		    //@todo - is change-up doing fufillment, or is it handled individually???
		    var finalPrice = getFinalPrice(productIdAndQuantity);

		    var finishedCharge = new Future();


		    Meteor.call('createStripeCustomer', stripeToken, email, function (err, customer){
		    	if(err) {
		    		console.error(err);
		    		finishedCharge.throw(new Meteor.Error("create-customer", "couldn't create a new customer"));
		    		return;
		    	}

		    	if(customer.message || customer.type == 'StripeInvalidRequestError') {
		    		console.error(customer);
		    		finishedCharge.throw(new Meteor.Error("stripe-failed","invalid request given to stripe"));
		    		return;
		    	}

		    	shipping.name = shipping.fullName;
		    	shipping.address = shipping.addressOne;

		    	var charge = {
		    		amount: dollarsToCents(finalPrice),
		        currency: 'usd',
		        customer: customer.id,
		        //shipping: shipping,
		        metadata: billing
		    	};

		    	Meteor.call('createStripeCharge', charge, function (err, charge) {
		    		if(err) {
		    			console.error(err);
		    			finishedCharge.throw(new Meteor.Error("charge-failed","charge failed"));
		    			return;
		    		}

		    		if(charge.message || charge.type == 'StripeInvalidRequestError'){
		    			console.error(charge);
		    			finishedCharge.throw(new Meteor.Error("charge-failed", "stripe charge failed"));
		    			return;
		    		}

		    		try{
		    			console.log('the shipping', shipping);
		    			var transaction = Transactions.insert({
			    			userId: Meteor.userId(), //@todo
				        order: cart,
				        price: finalPrice.toString(),
				        charityId: 'somerandomcharityid', //charity.id,
				        currency: 'usd',
				        email: email,
				        shipping: shipping,
				        billing: billing,
				        orderCompleted: true,
				        transactionId: charge.id,
				        paid: true,
				        stripeCustomer: charge.customer
			    		});

		    			return finishedCharge.return(transaction);
		    		} catch ($exc) {
		    			return finishedCharge.throw($exc);
		    		}
		    	});
		    })
	    } catch ($exc) {
	    	console.error($exc);
	    	throw new Meteor.Error($exc);
	    }

	    return finishedCharge.wait();
	  }
	})

	function shippingCheck (shipping) {
		return {
			addressOne : String,
			addressTwo : Match.Optional(String),
			city : String,
			fullName : String,
			zipcode : String,
			state : String,
			country : String
		}
	}	

	function billingCheck (billing) {
		var bill = {
			email : String,
			creditCardName : Match.Optional(String),
			password : Match.Optional(String),
			save : Match.Optional(Boolean),
			agree : Boolean
		};

		var checks = _.extend(bill, shippingCheck())

		return checks;
	}

	function charityCheck (charity) {
		return {
			name : String,
			category : String,
			id : String
		}
	}

	function dollarsToCents (price) {
		price = parseFloat(price).toFixed(2)
		var sides = price.split('.');

		var cents = 100 * parseInt(sides[0]);
		cents = cents + parseInt(sides[1]);

		return cents;
	}

	function getProductAndQuantity(cart) {
	  //get product ids
	  var productIdAndQuantity = {};
	  var productIds = [];

	  //find every unique product in the cart
	  _.each(cart, function(item) {
	    productIdAndQuantity[item.productId] = {
	      quantity: item.quantity
	    };

	    if (productIds.indexOf(item.productId) < 0)
	      productIds.push(item.productId);
	  })

	  //find each product in the db
	  var products = Products.find({
	    _id: {
	      $in: productIds
	    }
	  }).fetch();

	  //store each products sale and shipping price
	  products.forEach(function(product) {
	    productIdAndQuantity[product._id].price = product.price;
	    productIdAndQuantity[product._id].shippingPrice = product.shippingPrice;
	  });

	  return productIdAndQuantity;
	}

	function getFinalPrice(items) {
	  var finalPrice = 0;
	  _.each(items, function(product) {
	    finalPrice = (parseFloat(product.price) * parseInt(product.quantity)) + finalPrice + parseFloat(product.shippingPrice);
	  });

	  if (!_.isNumber(finalPrice) || finalPrice <= 0)
	    throw new Meteor.error('incorrect-pricing', 'something was wrong with the pricing of your items');

	  return finalPrice;
	}
})();