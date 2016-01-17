
	BankAccounts = new orion.collection('bankAccounts', {
		singularName : 'Bank Account',
		pluralName : 'Bank Accounts',
		link : {
			title : 'Bank Accounts'
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
