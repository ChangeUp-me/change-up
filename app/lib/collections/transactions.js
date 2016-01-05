Transactions = (function () {
	var Transactions = new orion.collection('transactions', {
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

	var TransactionsSchema = new SimpleSchema({
		userId : {
			type : String,
			optional : true
		},
		order : {
			type : [order()],
		},
		price : {
			type : String
		},
		charityId: {
			type : String
		},
		currency : {
			type : String,
			optional : true
		},
		timestamp : {
			type : Date,
			autoValue : function () {
				if(this.isInsert) {
					return new Date();
				} else {
					this.unset();
				}
			}
		},
		email : {
			type : String,
			max : 260
		},
		shipping : {
			type : shipping_schema(),
		},
		billing : {
			type : billing_schema(),
		},
		orderCompleted : {
			type : Boolean,
			defaultValue : false
		},
		transactionId : {
      type : String
    },
    processed : {
      type : Boolean,
      defaultValue : false
    },
    fufilled : {
      type : Boolean,
      defaultValue : false
    },
    paid : {
    	type : Boolean,
    	defaultValue : false
    },
    stripeCustomer : {
    	type : String
    }
	})

	Transactions.attachSchema(TransactionsSchema);

	return Transactions;

	function order () {
		return new SimpleSchema({
			vendorId : {
				type : String
			},
			productId : {
				type : String
			},
			quantity : {
				type : Number
			},
			productName : {
				type : String
			},
			price : {
				type : String
			},
			size : {
				type : String,
				optional : true
			},
			color : {
				type : String,
				optional : true
			},
			shippingPrice : {
				type : String
			}
		});
	}

	function billing_schema () {
		return new SimpleSchema({
			creditCardName : {
				type : String
			},
			lastFour : {
				type : Number
			},
			cardBrand : {
				type : String
			}
		})
	}

	function shipping_schema () {
		return new SimpleSchema({
			fullName : {
				type : String
			},
			address : {
				type : String,
			},
			city : {
				type : String
			},
			state : {
				type : String
			},
			zipcode : {
				type : Number
			},
			country : {
				type : String,
			}
		})
	}
})();
