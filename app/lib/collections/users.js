(function () {
	var UsersSchema = new SimpleSchema({
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
      optional: true,
      allowedValues : ['admin','user','vendor']
    },
		profile : {
 			type : Object,
 			blackbox : true,
 			optional : true
		},
		"profile.vendorId" : {
			type : String,
			optional : true
		},
		"profile.paymentInfo" : {
			type : payment_info_schema(),
			optional : true
		},
		"profile.cart" : {
			type : [cart_schema()],
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
		heartbeat: {
      type: Date,
      optional: true
    }
	});

	Meteor.users.attachSchema(UsersSchema);

	function payment_info_schema () {
		return new SimpleSchema({
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

	function toLowerCase () {
		var value = this.value;
		if(typeof value == 'string') {
			value = value.toLowerCase();
		}
		return value;
	}

	function cart_schema () {
		return new SimpleSchema({
			id : {
				type : String,
				unique : true,
				autoValue : function () {
					if(this.isUpdate) {
						return Random.id();
					}
				}
			},
			productId : {
				type : String
			},
			size : {
				type : String,
				optional : true,
				autoValue : toLowerCase
			},
			color : {
				type : String,
				optional : true,
				autoValue : toLowerCase
			},
			quantity : {
				type : Number,
				defaultValue : 1
			},
			charityId : {
				type : String,
				optional : true
			}
		})
	}
})();