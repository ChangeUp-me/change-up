
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
