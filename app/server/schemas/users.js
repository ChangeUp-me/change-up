(function () {
	UsersSchema = new SimpleSchema({
		userType : {
			type : String,
			allowedValues : ['user','admin','vendor']
		},
		name : {
			type : String
		},
		email : {
			type : String,
			max : 260
		},
		password : {
			type : String
		},
		twitter : {
			type : social_schema(),
			optional : true
		},
		facebook : {
			type : social_schema(),
			optional : true
		},
		likes : {
			type : likes_schema()
		},
		dateRegistered : {
			type : Date,
			defaultValue : Date.now
		},
		termsAgreement : {
			type : Boolean
		},
		cart : {
			type : cart_schema()
		},
		shipping : {
			type : shipping_schema()
		},
		billing : {
			type : billing_schema()
		},
		transactions : {
			type : [transactions_schema()]
		}
	});

	Meteor.users.attachSchema(UsersSchema);

	function transactions_schema () {
		return new SimpleSchema({
			orderId : {
				type : String
			},
			orderNumber : {
				type : String
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

	function likes_schema () {
		return new SimpleSchema({
			productId : {
				type : String
			}
		})
	}

	function social_schema () {
		return new SimpleSchema({
			id : {
				type : String
			}
		})
	}
})();