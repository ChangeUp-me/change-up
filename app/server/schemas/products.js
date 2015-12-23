(function () {
	ProductsSchema = new SimpleSchema({
		vendorId : {
			type : String,
		},
		name : {
			type : String,
		},
		description : {
			type : String,
			optional : true
		},
		price : {
			type : String
		},
		currency : {
			type : String,
			defaultValue : 'usd'
		},
		reviews : {
			type : [review_schema()],
			optional : true
		},
		quantity : {
			type : Number,
			defaultValue : 0
		},
		sizes : {
			type : [String],
			optional : true,
			defaultValue : []
		},
		details : {
			type : String,
			optional : true
		},
		image : {
			type : Object,
			blackbox: true,
			optional : true
		},
		shippingPrice : {
			type : String,
			defaultValue : '0.0'
		},
		//countriesAllowedToShip : []
		percentToCharity : {
			type : Number,
			defaultValue : 5
		},
		deleted : {
			type : Boolean,
			defaultValue : false
		},
		likeCount : {
			type : Number,
			defaultValue : 0
		}
	})

	Products.attachSchema(ProductsSchema);

	function review_schema () {
		return new SimpleSchema({
			rating : {type : Number},
			title : {type : String},
			name : {type : String},
			userId : {type : String},
			timestamp : {type : Date, defaultValue : Date.now},
			review : {type : String}
		})
	}
})();