Meteor.methods({
	addToCart : function add_to_cart (cartItem) {
		//check if the item is already in the cart
		var item = Meteor.users.find({_id : Meteor.userId()},{'profile.cart.productId' : cartItem.productId}).fetch();

		if(item.length > 0) {
			//@todo - make sure it doesn't inc everything
			return Meteor.users.update({
				_id : Meteor.userId(),
				'profile.cart.productId' : cartItem.productId
			}, {
				$inc : {'profile.cart.$.quantity' : 1}
			})
		}

		Meteor.users.update({
			_id : Meteor.userId()
		}, {
			$inc : {'profile.cart.productId' : {quantity : 1}}
		});
	},
	removeFromCart : function remove_from_cart (id) {
		//weird error where mongodb $pull won't work
		//in meteor but will in console
		//$pull : {'profile.cart': {id :id}}
		var user = Meteor.user();

		if(!user) {
			throw new Meteor.Error('not-logged-in', 'the user is not logged in');
		}

		var cart = user.profile.cart;

		var indx = cart.findIndex(function (item) {
			return item.id == id;
		})

		cart.splice(indx, 1);

		Meteor.users.update(Meteor.userId(), {$set : {'profile.cart' : cart}});
	},
	checkout : function checkout (charity, billing, shipping, stripeToken, email) {
		var Stripe = StripeAPI('SECRET_KEY');

		var user = Meteor.user();
		var cart = user.profile.cart;

		if(user) {
			email = user.emails[0].address
		}

		//get product ids
		var productIdAndQuantity = {};
		var productIds = [];

		//find every unique product in the cart
		_.each(cart, function (item) {
			productIdAndQuantity[item.productId] = {quantity : item.quantity};

			if(productIds.indexOf(item.productId) < 0 )
				productIds.push(item.productId);
		})

		//find each product in the db
		var products = Products.find({_id : {$in : productIds}}).fetch();

		//store each products sale and shipping price
		products.forEach(function (product) {
			productIdAndQuantity[product._id].price = product.price;
			productIdAndQuantity[product._id].shippingPrice = product.shippingPrice;
		});

		//add up the total price of every item (including shipping)
		//@todo - is change-up doing fufillment, or is it handled individually???
		var finalPrice = 0;
		_.each(productIdAndQuantity, function (product) {
			finalPrice = (parseFloat(product.price) * parseInt(product.quantity)) + finalPrice + parseFloat(product.shippingPrice);
		});

		if(!_.isNumber(finalPrice) || finalPrice <= 0)
			throw new Meteor.error('incorrect-pricing', 'something was wrong with the pricing of your items');

		return;

		Stripe.customers.create({
			email : email
		}).then(function charge_customer (customer) {
			return Stripe.charges.create({
				amount: finalPrice,
      	currency: 'usd',
      	customer: customer.id,
      	source : stripeToken,
      	shipping : shipping,
      	metadata : billing
			})
		}).then(function insert_transaction (charge) {
			Transactions.insert({
				userId : Meteor.userId(), //@todo
				order : cart,
				price : finalPrice.toString(),
				charityId : charity.id,
				currency : 'usd',
				email : email,
				shipping : shipping,
				billing : billing,
				orderCompleted : true,
				orderNumber : charge.invoice,
				transactionId : charge.id,
				paid : true,
				stripeCustomer : charge.customer
			})
		}).catch(function checkout_error(err) {
			throw new Meteor.Error(err);
		})
	}
})