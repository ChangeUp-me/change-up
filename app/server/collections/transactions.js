Transactions = new Mongo.Collection('transactions')

Meteor.methods({
	insertTransaction : function insert_transactions (transactionObj) {
		Transactions.insert(transactionObj);
	},
	updateTransaction : function update_transactions (transactionId, transactionObj) {
		Transactions.update({_id : transactionId, userId : Meteor.userId()}, {$set : transactionObj})
	}
});

Meteor.publish('transaction', function publish_transaction (transactionId) {
	return Transactions.findOne({_id : transactionId});
});

Meteor.publish('transactions', function publish_transactions (forWho) {
	var selector = {};
	var allowedTypes = ['user', 'vendor', 'product']

	//@todo - throw an error here
	if(allowedTypes.indexOf(forWho) < 0)
		return;

	switch(forWho) {
		case 'user' :
			selector['userId'] = id;
			break;
		case 'product' :
			selector['productId'] = id;
			break;
		case 'vendor' :
			selector['vendorId'] = id;
			break;
	}

	return Transactions.find(selector)	
});