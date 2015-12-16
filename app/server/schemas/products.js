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
			type : Number,
			optional : true
		},
		//countriesAllowedToShip : []
		percentToCharity : {
			type : Number,
			defaultValue : 5.0
		},
		deleted : {
			type : Boolean,
			defaultValue : false
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