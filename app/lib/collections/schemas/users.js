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
		"profile.shipping" : {
			type : shipping_schema(),
			optional : true
		},
		"profile.billing" : {
			type : billing_schema(),
			optional : true
		},
		"profile.cart" : {
			type : [cart_schema()],
			optional : true
		},
		"profile.cardToken" : {
			type : String,
			optional : true
		},
		"profile.customerToken" : {
			type : String,
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

	function billing_schema () {
		return new SimpleSchema({
			fullName : {
				type : String
			},
			addressOne : {
				type : String
			},
			addressTwo : {
				type : String
			},
			city : {
				type : String
			},
			zipcode : {
				type : Number
			},
			state : {
				type : String
			},
			country : {
				type : String
			},
			expirationDate : {
				type : String,
			},
			lastFour : {
				type : String
			},
			cardBrand : {
				type : String
			},
			termsAgreement : {
				type : Boolean
			},
		});
	}

	function shipping_schema () {
		return new SimpleSchema({
			fullName : {
				type : String
			},
			addressOne : {
				type : String,
			},
			addressTwo : {
				type : String
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
				autoValue : function () {
					if(this.isUpdate) {
						return Random.id();
					}
					this.unset();
				}
			},
			image : {
				type : Object,
				blackbox : true
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