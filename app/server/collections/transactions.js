Transactions = new Mongo.Collection('transactions')

Meteor.methods({
	insertTransactions : function insert_transactions (transactionObj) {
		Transactions.insert(transactionObj);
	},

	/**
	* Get a list of transactions for a vendor, product, or by a user
	*
	* @param String forWho - 'vendor' | 'user' | 'product'
	* @param String id - the id of the person, item, or entity you want to transactions for
	* @param Number howMany - the amount of transactions to show
	* @param Number skip - the amount of transactions to skip over
	*/
	listTransactions : function list_transactions (forWho, id, howMany, skip) {
		howMany = howMany || 30;
		skip = skip || 0;

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

		Transactions
		  .find(selector)
		  .limit(howMany)
		  .skip(skip)
		  .fetch()
	},
	showTransactions : function show_transactions (transactionId) {
		Transactions.findOne({_id : transactionId}).fetch();
	},
	updateTransactions : function update_transactions (transactionId, transactionObj) {
		Transactions.update({_id : transactionId, userId : Meteor.userId()}, {$set : transactionObj})
	}
});