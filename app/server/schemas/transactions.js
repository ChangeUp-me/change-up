(function () {
	TransactionsSchema = new SimpleSchema({
		userId : {
			type : String
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
			type : Object
		},
		billing : {
			type : Object
		},
		orderCompleted : {
			type : Boolean,
			defaultValue : false
		},
		orderNumber : {
			type : String
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
			price : {
				type : Number
			},
			shippingPrice : {
				type : Number
			}
		});
	}

	function billing_schema () {
		return new SimpleSchema({
			cardNumber : {
				type : Number // we probably shouldn't store this here
			},
			expirationDate : {
				type : String,
			},
			cvv :{
				type : Number,
				optional : true
			},
			termsAgreement : {
				type : Boolean
			}
		})
	}

	function shipping_schema () {
		var addressesSchema = new SimpleSchema({
			address : {
				type : String
			}
		})

		return new SimpleSchema({
			fullName : {
				type : String
			},
			addresses : {
				type : [addressesSchema],
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
