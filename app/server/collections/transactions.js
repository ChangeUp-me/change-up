Meteor.methods({
	insertTransaction : function insert_transactions (transactionObj) {
		Transactions.insert(transactionObj);
	},
	updateTransaction : function update_transactions (transactionId, transactionObj) {
		Transactions.update({_id : transactionId, userId : this.userId}, {$set : transactionObj})
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

	return Transactions.find({
		"order.vendorId" : vendorId
	}, {
		order : {$elemMatch : {vendorId : vendorId}}
	});
});