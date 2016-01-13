Transactions = new orion.collection('transactions', {
	  singularName: 'transaction',
	  pluralName: 'transactions',
	  link: {
	    title: 'transactions'
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