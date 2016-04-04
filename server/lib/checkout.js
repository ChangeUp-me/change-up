CHECKOUT = (function () {

	function checkout (shipping, billing, stripeToken, email, cart) {
		try{
			this.stripeApiKey = "sk_live_rNjG94LGyl52oDz7ZMTCSilq"//Meteor.settings.private.stripe.apiKey;
			// // Test
			// this.stripeApiKey = "sk_test_Q9FAVkLWaoB0eWjSBKm9XL9Y"
			this.baseUrl = "http://www.changeup.me";
			//this.mailchimp = new Mailchimp("59d589bd95de09e03eef8b665f52fa7c-us13");

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
		this.stripeToken = stripeToken;
		this.email = email;
		this.stripe = StripeAPI(this.stripeApiKey);
		this.shippingCost = this._getShippingCost(cart);

		this.shipping.name = this.shipping.fullName;
		this.shipping.address = this.shipping.addressOne;

		this.stripeCustomer;
		this.stripeCharge;
		this.vendorIds = [];

		this.order;
		this.finalPrice;
	}

	checkout.prototype.chargeExistingCustomer = function (customer, callback) {
		var self = this;

		this._getOrder();
		this._getFinalPrice();

		function save_new_transaction (err, stripeCharge) {
			if(err) {
				console.error(err, err.stack);

				//the customer probably doesn't exist anymore
				//try to create a new customer
				if(err.param == 'customer') {
					return self.chargeNewCustomer(callback);
				}

				return callback(new Meteor.Error("charge-failed","charge failed"));
			}

			self.stripeCharge = stripeCharge;

			var transactionObj = self._getTransactionObj();
			var transaction = Transactions.insert(transactionObj);
			callback(null, transaction);

			//send each vendor an email async
			Meteor.setTimeout(function () {
				self._sendVendorEmails(self.vendorIds);
			});
		}

		self._createStripeCharge(customer, save_new_transaction);
	}

	checkout.prototype.chargeNewCustomer = function (callback) {
		var self = this;

		//set the order property
		this._getOrder();

		//set the final price
		this._getFinalPrice();

		function save_new_transaction (err, stripeCharge) {
			if(err) {
				console.error(err, err.stack);
				return callback(new Meteor.Error("charge-failed","charge failed"));
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
			callback(null, transaction);
		} catch ($e) {
			console.error('save-new-transaction', $e);
			callback($e);
		}

		//send each vendor an email
		Meteor.setTimeout(function () {
			self._sendVendorEmails(self.vendorIds);
		});
	}

	//@todo - check if customer already exists first
	function charge_new_customer(err, stripeCustomer){
		if(err) {
			console.error('charge-new-customer', err);
			console.error(err.stack);
			return callback(new Meteor.Error("create-customer-failed", "couldn't create a new customer"));
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
			shippingPrice : Vendors.findOne({"_id":product.vendorId}).shippingPrice,
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
	_.each(self.order, function (elem, key) {
		order.push(elem);
	});

	return self.order = order;
};

checkout.prototype._getFinalPrice = function () {
	var finalPrice = 0;

	_.each(this.order, function(product) {
		finalPrice = (parseFloat(product.price) * parseInt(product.quantity))
		+ finalPrice;
	});

	// SHIPPING IS HERE!
	finalPrice += this.shippingCost;

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
	var self = this;

	if(vendors) {
		var userIds = [];
		var order = this.order;
		var billing = this.billing;
		var vendorEmails = {};
		var body = "";
		var br = '\n';

		vendors.forEach(function (vendor){
			//get each userId from vendor
			userIds.push(vendor.userId);

			vendorEmails[vendor.userId] = [];
			body = "";

			//construct order email for each item
			_.forEach(order, function (item) {
				if(item.vendorId == vendor._id) {
					body += "Hi " + vendor.storeName + "," + br;
					body += billing.creditCardName + " has bought " + item.quantity + " " + item.productName;
					body += " from the ChangeUp marketplace.  Here are the details provided to fulfill your order!" + br + br;
					body += "Item Name: " + item.productName + br;
					body += "Order ID: " + item.orderId + br; //@todo? 
					body += "Quantity: " + item.quantity + br;
					body += "Shipping: " + item.shipping + br;
					body += "Total Cost: " + parseFloat(Number(item.price) * item.quantity).toFixed(2) + br;
					body += "Customer Name: " + billing.creditCardName + br;
					body += "Customer Email: " + self.email + br;
					body += "Customer Shipping Address: " + self.shipping.address + br + br; 

					vendorEmails[vendor.userId].push(body);
				}
			});
		});

		//find Each user
		var users = Meteor.users.find({_id : {$in : userIds}}).fetch();

		try{
			//send emails to each vendor
			users.forEach(function (user) {
				_.forEach(vendorEmails[user._id], function (email) {
					Email.send({
						to : user.emails[0].address,
						from : 'hello@changeup.me',
						subject : 'new order!',
						text : email
					})
				});
			})
		} catch (e) {
			console.error('send-vendor-email', 'vendor might not have an email');
			console.error('send-vendor-email', e.stack);
		}
	}
}

checkout.prototype._refundCustomer = function (stripeCharge, callback) {
	if(!stripeCharge) return console.error('no charge object given to refund');

	this.stripe.charges.refund(stripeCharge.id, Meteor.bindEnvironment(callback));
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
			charityId : item.charityId
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

checkout.prototype._subscribeCustomer = function () {
		var name = billing.creditCardName || "";
		name = name.trim().split(" ");
		var firstName = name[0];
		var lastName = "";

		if(name.length > 1) {
			lastName = name[name.length - 1];
		}

		//ratingMessage
		var ratingMessage = "";
		var baseUrl = this.baseUrl;

		_.forEach(this.order, function (item) {
			ratingMessage += this.baseUrl + "/item/" + item.productId + '\n';
		});

		var result = this.mailchimp('lists', 'subscribe', {
			email_address : this.email,
			merge_fields : {
				FNAME : firstName,
				LNAME : lastName,
				mc_notes : [{
					note : ratingMessage
				}]
			},
			status : "subscribed",
			list_id : "69989",
			double_optin : false
		}, function (error, result) {
			if(error) {
				console.error(error);
			}
		});

		console.log('the result', result);
	}

checkout.prototype._getShippingCost = function (cart) {
		var shippingTotalArray = [];
		var duplicates = {};
		var cleanedArray = [];
		var shippingCost = 0;


		for (var i = 0; i < cart.length; i++) {
			var shippingInfo = {'vendorId': cart[i].vendorId, "vendorShipping": Vendors.findOne({_id: cart[i].vendorId}).shippingPrice}

			shippingTotalArray.push(shippingInfo)
		}

		for (var i = 0; i < shippingTotalArray.length; i++) {
			if (!duplicates[shippingTotalArray[i].vendorId]) {
				duplicates[shippingTotalArray[i].vendorId] = true;
				cleanedArray.push(shippingTotalArray[i]);
			}
		}

		for (var i = 0; i < cleanedArray.length; i++) {
			shippingCost += parseFloat(cleanedArray[i].vendorShipping) || 0;
		}

		return shippingCost;
	};




/**
* Helpers
*/
function checkArgs () {
	var shipping = arguments[0];
	var billing = arguments[1];
	var stripeToken = arguments[2];
	var email = arguments[3];
	var cart = arguments[4];

	check(cart, Array);
	check(billing, billingCheck());
	check(shipping, shippingCheck());
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
