Meteor.methods({
	insertTransaction : function insert_transactions (transactionObj) {
		Transactions.insert(transactionObj);
	},
	updateTransaction : function update_transactions (transactionId, transactionObj) {
		Transactions.update({_id : transactionId, userId : this.userId}, {$set : transactionObj})
	},
	fulfillOrder : function fulfill_order (transaction, itemIds) {
		for (var i = 0; i < itemIds.length; i++) {
			Transactions.update({
				'_id' : transaction,
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

			//don't wait up for this
			Meteor.setTimeout(function () {
				Email.send({
					to : transaction.email,
					from : 'terrell.changeup@gmail.com',
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
