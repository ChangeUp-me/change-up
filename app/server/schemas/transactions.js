(function () {
	TransactionsSchema = new SimpleSchema({
		userId : {
			type : String
		},
		productId : {
			type : String
		},
		vendorId : {
			type : String
		},
		price : {
			type : Number
		},
		charityAllocationPerct :{
			type : Number
		},
		charityId : {
			type : Number
		},
		currency : {
			type : String,
			optional : true
		},
		timestamp : {
			type : Date,
			defaultValue : Date.now
		},
		email : {
			type : String,
			max : 260
		},
		billing : {
			type : billing_schema()
		},
		shipping : {
			type : shipping_schema()
		},
		orderCompleted : {
			type : Boolean,
			defaultValue : false
		},
		orderNumber : {
			type : Number
		}
	})

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
