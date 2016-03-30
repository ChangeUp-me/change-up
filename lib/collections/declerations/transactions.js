Transactions = new orion.collection('transactions', {
	  singularName: 'Transaction',
	  pluralName: 'Transactions',
	  link: {
	    title: 'Transactions'
	  },
	  tabular: {
	    columns: [{
	      data: 'price',
	      title: 'price'
	    }, {
	      data: 'email',
	      title: 'email,'
	    }, {
	      data: 'processed',
	      title: 'processed'
	    }, {
	      data : 'fufilled',
	      title : 'fufilled'
	    }]
	  }
	});