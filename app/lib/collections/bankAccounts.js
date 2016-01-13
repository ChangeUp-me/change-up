(function () {
	BankAccounts = new orion.collection('bankAccounts', {
		singularName : 'bank Account',
		pluralName : 'bank Accounts',
		link : {
			title : 'bank Accounts'
		},
		tabular : {
			columns : [{
				data : 'entityType',
				title : 'Entity Type'
			},{
				data : 'category',
				title : 'Category'
			}]
		}
	})

	BankAccounts.attachSchema(schema())

	function schema () {
		return new SimpleSchema({
			stripeAccountId : {
				type : String
			},
			vendorId : {
				type : String,
				optional : true
			},
			charityId : {
				type : String,
				optional : true
			},		
			entityType : { //vendor,charity
				type : String
			}
		});
	}
})();
