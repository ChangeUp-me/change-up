function dollarsToCents (price) {
	price = parseFloat(price).toFixed(2)
	var sides = price.split('.');

	var cents = 100 * parseInt(sides[0]);
	cents = cents + parseInt(sides[1]);

	return cents;
}

Meteor.methods({
	insertTransaction : function insert_transactions (transactionObj) {
		Transactions.insert(transactionObj);
	},
	updateTransaction : function update_transactions (transactionId, transactionObj) {
		Transactions.update({_id : transactionId, userId : this.userId}, {$set : transactionObj})
	},
	//@note - this is a vendor method, NOT an admin method
	cancelOrder : function cancel_order (transactionId, itemIds) {
		var transaction = Transactions.findOne({'order.orderId': itemIds[0]});
		var vendor = Vendors.findOne({userId : Meteor.userId()});
		var shippingPrice = vendor.shippingPrice;

		var stripe = StripeAPI("sk_live_rNjG94LGyl52oDz7ZMTCSilq");
		var totalRefundAmount = 0;

		//get total amount to refund
		_.each(transaction.order, function (item) {
			//get the total price for the current items
			if(itemIds.indexOf(item.orderId) > -1) {
				totalRefundAmount += parseFloat(item.price * parseInt(item.quantity));
			}
		});

		//add the shipping price
		totalRefundAmount + parseFloat(shippingPrice);


		if(transaction && vendor) {
			//remove the order items
			Transactions.update({
				_id : transactionId
			}, {
				$pull : {order : {orderId : {$in : itemIds}}}
			})

			//refund the transaction
			stripe.refunds.create({
				charge : transaction.transactionId,
				amount : dollarsToCents(totalRefundAmount)
			}, Meteor.bindEnvironment(function (err, refund) {
				if(err) {
					console.error(err);
					throw new Meteor.Error('refund', "could not refund the order");
				}

				console.log('teh result', refund);
			}));

			//find every order in the transaction that belongs
			//to the vendor
			var items = _.filter(transaction.order, function (item) {
				return item.vendorId == vendor._id;
			});

			//construct a refund message
			var body = vendor.storeName + " has refunded your order";

			_.each(items, function (item) {
				body += "\n";
				body += item.productName + " | $" + item.price;

				if(item.size) body += " | " + item.size;

				body += ' | ' + item.quantity + 'x'
			});

			Meteor.setTimeout(function () {
				Email.send({
					to : transaction.email,
					from : 'hello@changeup.me',
					subject : 'your order has been refunded!',
					text : body
				})
			}, 10);
		} else {
			throw new Meteor.Error('send-email', "could not email the buyer about the refund")
		}
	},
	fulfillOrder : function fulfill_order (transactionId, itemIds) {
		//@todo - this can be done in 1 query
		//loop through each item and update the transaction record
		//set each transaction to fulfilled
		for (var i = 0; i < itemIds.length; i++) {
			Transactions.update({
				'_id' : transactionId,
				'order.orderId' : itemIds[i]
			}, {
				$set : {'order.$.fulfilled' : true}
			});
		}

		var transaction = Transactions.findOne({'order.orderId': itemIds[0]});
		var vendor = Vendors.findOne({userId : Meteor.userId()});

		if(transaction && vendor) {
			var body = "";

			//find every order in the transaction that belongs
			//to the vendor
			var items = _.filter(transaction.order, function (item) {
				return item.vendorId == vendor._id;
			})

			//construct a shipping email
			//@todo - need email template
			body += vendor.storeName + " has shipped your order:"

			_.each(items, function (item) {
				body += "\n";
				body += item.productName + " | $" + item.price;

				if(item.size) body += " | " + item.size;

				body += ' | ' + item.quantity + 'x'
			});

			//notify the user that their order has been shipped
			//don't wait up for this
			Meteor.setTimeout(function () {
				Email.send({
					to : transaction.email,
					from : 'hello@changeup.me',
					subject : 'your order has been shipped!',
					text : body
				})
			}, 10);
		} else {
			throw new Meteor.Error('send-email', "could not email the buyer")
		}
	}
});

Meteor.publish('transaction', function publish_transaction (transactionId) {
	return Transactions.findOne({_id : transactionId});
});

Meteor.publish('userTransactions', function publish_transactions () {
	return Transactions.find({userId : this.userId})
});

Meteor.publish('vendorTransactions', function vendor_transactions () {
	var user = Meteor.users.findOne(this.userId);
	var vendorId = (user && user.profile.vendorId) ? user.profile.vendorId : null;

	return Transactions.find({"order.vendorId" : vendorId});
});

Meteor.publish('allTransactions', function all_transactions () {
	var isAdmin = Roles.userHasRole(this.userId, 'admin');

	if(isAdmin) {
		return Transactions.find({});
	} else {
		return Transactions.find({userId : this.userId})
	}
});
