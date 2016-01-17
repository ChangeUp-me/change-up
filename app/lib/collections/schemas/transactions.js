(function () {
  if(Meteor.isServer) {
		Transactions.attachSchema(new SimpleSchema(transactionsSchema()));
	} else if(Meteor.isClient) {
		var schema = transactionsSchema();

		schema = _.omit(schema, ['order','charityId','transactionId','stripeCustomer','price','userId']);

		Transactions.attachSchema(new SimpleSchema(schema));
	}

	function transactionsSchema () {
		return {
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
		}
	}

	function order () {
		//@todo - this should be (itemId)
		return new SimpleSchema({
			orderId : {
				type : String,
				autoValue : function () {
					if(this.isInsert) {
						return Random.id();
					} else {
						this.unset();
					}
				}
			},
			image : {
				type : Object,
				blackbox : true,
			},
			percentToCharity : {
				type : Number
			},
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
			},
			fundsTransfered : {
				type : Boolean,
				defaultValue : false
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