(function () {
	UsersSchema = new SimpleSchema({
		username : {
			type : String,
			optional : true
		},
		emails : {
			type : Array,
			optional : true
		},
		"emails.$": {
      type: Object
    },
    "emails.$.address": {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
      type: Boolean
    },
    createdAt: {
      type: Date,
      autoValue : function () {
				if(this.isInsert) {
					return new Date();
				} else {
					this.unset();
				}
			}
    },
		services : {
			type : Object,
			optional : true,
			blackbox : true
		},
		roles: {
      type: [String],
      optional: true
    },
		profile : {
 			type : Object,
 			blackbox : true,
 			optional : true
		},
		"profile.vendor" : {
			type : vendor_schema(),
			optional : true
		},
		"profile.paymentInfo" : {
			type : payment_info_schema(),
			optional : true
		},
		"profile.dateRegistered" : {
			type : Date,
			autoValue : function () {
				if(this.isInsert) {
					return new Date();
				} else {
					this.unset();
				}
			}
		},
		"profile.likes" : {
			type : [likes_schema()],
			defaultValue : []
		},
		heartbeat: {
      type: Date,
      optional: true
    }
	});

	Meteor.users.attachSchema(UsersSchema);

	function vendor_schema () {
		return new SimpleSchema({
			storeName : {
				type : String
			},
			vendorName : {
				type : String
			},
			orders : {
				type : orders_schema()
			},
			unseenOrders : {
				type : [transaction_schema()]
			},
		});
	}

	function payment_info_schema () {
		return new SimpleSchema({
			cart : {
				type : cart_schema(),
				optional : true
			},
			shipping : {
				type : shipping_schema(),
				optional : true
			},
			billing : {
				type : billing_schema(),
				optional : true
			}, 
		})
	}

	function orders_schema () {
		return new SimpleSchema({
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
			}
		})
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
		});
	}

	function shipping_schema () {
		var addressesSchema = new SimpleSchema({
			address : {
				type : String
			}
		});

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

	function cart_schema () {
		return new SimpleSchema({
			productId : {
				type : String
			},
			size : {
				type : String
			},
			color : {
				type : String
			},
			quantity : {
				type : String
			}
		})
	}

	function transaction_schema () {
		return new SimpleSchema({
			transactionId : {
				type : String
			}
		})
	}

	function likes_schema () {
		return new SimpleSchema({
			productId : {
				type : String
			}
		})
	}
})();