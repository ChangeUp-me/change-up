CHECKOUT = (function () {

	function checkout (shipping, billing, charity, stripeToken, email, cart) {
		try{
			this.stripeApiKey = "sk_mKLYgZGYkqjzg5DPyyc0u2hrYnhgR"//Meteor.settings.private.stripe.apiKey;

			//check that all the given arguments are valid
			checkArgs.apply(this, arguments);
		} catch ($e) {
			console.error($e.stack);
			throw new Meteor.Error('invalid-params', "your data was invalid");
			return;
		}

		this.cart = cart;
		this.shipping = shipping;
		this.billing = billing;
		this.charity = charity;
		this.stripeToken = stripeToken;
		this.email = email;
		this.stripe = StripeAPI(this.stripeApiKey);

		this.shipping.name = this.shipping.fullName;
		this.shipping.address = this.shipping.addressOne;

		this.stripeCustomer;
		this.stripeCharge;
		this.vendorIds = [];

		this.order;
		this.finalPrice;
	}

	checkout.prototype.chargeExistingCustomer = function (customer, $Fiber) {
		var self = this;

		this._getOrder();
		this._getFinalPrice();

		function save_new_transaction (err, stripeCharge) {
			if(err) {
				console.error(err);
				return $Fiber.throw(new Meteor.Error("charge-failed","charge failed"));
			}

			self.stripeCharge = stripeCharge;

			var transactionObj = self._getTransactionObj();
			var transaction = Transactions.insert(transactionObj);
			$Fiber.return(transaction);

			//send each vendor an email
			self._sendVendorEmails(self.vendorIds);
		}

		self._createStripeCharge(customer, save_new_transaction);
	}

	checkout.prototype.chargeNewCustomer = function ($Fiber) {
		var self = this;

		//set the order property
		this._getOrder();

		//set the final price
		this._getFinalPrice();		

		function save_new_transaction (err, stripeCharge) {
			if(err) {
				console.error(err);
				return $Fiber.throw(new Meteor.Error("charge-failed","charge failed"));
			}

			self.stripeCharge = stripeCharge;

			//only the card if the user requested it
			//@todo - support multiple cards?
			/*if(self.billing.save) {
				//save new card
			  self._saveCard(stripeCharge.source.id)
			}*/

			//save newly created customer
			self._saveCustomer(stripeCharge.customer);

			try{
				var transactionObj = self._getTransactionObj();
				var transaction = Transactions.insert(transactionObj);
				$Fiber.return(transaction);
			} catch ($e) {
				console.error('save-new-transaction', $e);
				$Fiber.throw($e);
			}

			//send each vendor an email
			self._sendVendorEmails(self.vendorIds);
		}

		//@todo - check if customer already exists first
		function charge_new_customer(err, stripeCustomer){
			if(err) {
		   console.error('charge-new-customer', err);
		   return $Fiber.throw(new Meteor.Error("create-customer-failed", "couldn't create a new customer"));
		  }

		  //save 

		  self.stripeCustomer = stripeCustomer;
		  self._createStripeCharge(null, save_new_transaction);
		}


		this._createStripeCustomer(charge_new_customer);
	}

	checkout.prototype.getCard = function () {
		var user = Meteor.user();
		var card = false;

		if(user && user.profile.cardToken) {
			token = user.profile.cardToken;
		}

		return card;
	};

	checkout.prototype.getCustomer = function () {
		var user = Meteor.user();
		var token = false;

		if(user && user.profile.customerToken) {
			token = user.profile.customerToken;
		}

		return token;
	};

	checkout.prototype._saveCustomer = function (customer) {
		customer = customer || this.stripeCustomer;
		var user = Meteor.user();
		if(user) {
			Meteor.users.update(Meteor.userId(), {$set : {"profile.customerToken" : customer}})
		}
	};

	checkout.prototype._saveCard = function (cardId) {
		cardId = cardId || this.stripeCharge.source.id;
		var user = Meteor.user();

		if(user) {
			Meteor.users.update(Meteor.userId(), {$set : {"profile.cardToken" : customer}})
		}
	}

	checkout.prototype._getOrder = function () {
		var self = this;
		var productIds = self._findProductIds();

		//find each product in the db
	  var products = Products.find({
	    _id: {
	      $in: productIds
	    }
	  }).fetch();

	  //store each products sale and shipping price
	  //in the order object
	  products.forEach(function(product) {
	  	self.order[product._id] = _.extend(self.order[product._id], {
	  		price : product.price,
	  		shippingPrice : product.shippingPrice,
	  		vendorId : product.vendorId,
	  		image : product.image,
	  		productId : product._id,
	  		productName : product.name,
	  		percentToCharity : product.percentToCharity
	  	});

	    //store each unique vendor id
	    if(self.vendorIds.indexOf(product.vendorId) < 0)
	    	self.vendorIds.push(product.vendorId);
	  });

	  //convert order to array
	  var order = [];
	  _(self.order).each(function (elem, key) {
	  	order.push(elem);
	  });

	  return self.order = order;
	};

	checkout.prototype._getFinalPrice = function () {
		var finalPrice = 0;
	  _.each(this.order, function(product) {
	    finalPrice = (parseFloat(product.price) * parseInt(product.quantity)) 
	    	+ finalPrice 
	    	+ parseFloat(product.shippingPrice);
	  });

	  if (!_.isNumber(finalPrice) || finalPrice <= 0)
	    throw new Meteor.error('incorrect-pricing', 'something was wrong with the pricing of your items');

	  return this.finalPrice = finalPrice;
	}

	checkout.prototype._createStripeCustomer = function (callback) {
		this.stripe.customers.create({
	  	source : this.stripeToken,
	  	email : this.email,
	  	shipping : {
	  		name : this.shipping.fullName,
	  		address : {
	  			country : "US", //@todo,
	  			city : this.shipping.city,
	  			line1 : this.shipping.addressOne,
	  			postal_code : this.shipping.zipcode,
	  			state : this.shipping.state
	  		}
	  	}
	  }, Meteor.bindEnvironment(callback));
	};

	checkout.prototype._sendVendorEmails = function (vendorIds) {
		var vendors = Vendors.find({_id : {$in : vendorIds}}).fetch();

		if(vendors) {
			var userIds = [];

			//get each userId from vendor
			vendors.forEach(function (vendor){
				userIds.push(vendor.userId);
			});

			//find Each user
			var users = Meteor.users.find({_id : {$in : userIds}}).fetch();

			try{
				//send an email to each user
				users.forEach(function (user) {
					Email.send({
						to : user.emails[0].address,
						from : 'terrell.changeup@gmail.com',
						subject : 'new order!',
						text : 'A new order has been submitted. Log on to changeup.com to check it out!'
					})
				})
			} catch (e) {
				console.error('send-vendor-email', e.stack);
			}
		}
	}

	checkout.prototype._refundCustomer = function (stripeCharge) {
		if(!stripeCharge) return console.error('no charge object given to refund');

		this.stripe.charges.refund(stripeCharge.id);
	};

	checkout.prototype._createStripeCharge = function (customerId, callback) {
		var charge = this._getChargeObj(customerId);
		this.stripe.charges.create(charge, Meteor.bindEnvironment(callback));
	}

	checkout.prototype._getChargeObj = function (customerId) {
		return {
			amount: dollarsToCents(this.finalPrice),
		  currency: 'usd',
		  customer: customerId || this.stripeCustomer.id,
		  shipping : {
	  		name : this.shipping.fullName,
	  		address : {
	  			country : "US", //@todo,
	  			city : this.shipping.city,
	  			line1 : this.shipping.addressOne,
	  			postal_code : this.shipping.zipcode,
	  			state : this.shipping.state
	  		}
	  	},
		  metadata: this.billing
		}
	}

	checkout.prototype._getTransactionObj = function () {
		var obj = {
			order: this.order,
			price: parseFloat(this.finalPrice).toFixed(2),
			charityId: this.charity.id, //charity.id,
			currency: 'usd',
			email: this.email,
			shipping: this.shipping,
			billing: this.billing,
			orderCompleted: true,
			transactionId: this.stripeCharge.id,
			paid: true,
			stripeCustomer: this.stripeCharge.customer
		}
		var user = Meteor.userId();
		if(user) {
			obj.userId = user;
		}
		return obj;
	}

	checkout.prototype._findProductIds = function () {
		var self = this;

	  self.order = {};
	  var productIds = [];

	  //find every unique product in the cart
	  _.each(this.cart, function(item) {
	    self.order[item.productId] = {
	      quantity: item.quantity,
	    };

	    if(item.size) {
	    	self.order[item.productId].size = item.size;
	    }

	    if(item.color) {
	    	self.order[item.productId].color = item.color;
	    }

	    if (productIds.indexOf(item.productId) < 0)
	      productIds.push(item.productId);
	  });

	  return productIds;
	};


	/**
	* Helpers
	*/
	function checkArgs () {
		var shipping = arguments[0];
		var billing = arguments[1];
		var charity = arguments[2];
		var stripeToken = arguments[3];
		var email = arguments[4];
		var cart = arguments[5];

		check(cart, Array);
		check(billing, billingCheck());
		check(shipping, shippingCheck());
		check(charity,charityCheck());
		check({token : stripeToken}, {token : String});
	  check({email : email}, {email : String});
	}

	function dollarsToCents (price) {
		price = parseFloat(price).toFixed(2)
		var sides = price.split('.');

		var cents = 100 * parseInt(sides[0]);
		cents = cents + parseInt(sides[1]);

		return cents;
	}

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
			save : Match.Optional(Boolean),
			agree : Boolean,
			lastFour : String,
			cardBrand : String
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


	return checkout;
})();