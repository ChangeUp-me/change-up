(function () {
	ProductsSchema = new SimpleSchema({
		vendorId : {
			type : String,
		},
		title : {
			type : String,
		},
		description : {
			type : String,
		},
		price : {
			type : Number,
		},
		currency : {
			type : Number,
		},
		reviews : {
			type : [review_schema()]
		},
		quantity : {
			type : Number
		},
		size : {
			type : String,
			optional : true
		},
		likeCount : {
			type : Number,
			defaultValue : 0
		},
		dealEndDate : {
			type : Date,
			defaultValue : Date.now
		},
		details : {
			type : String
		},
		image : {
			type : Object
		},
		shippingPrice : {
			type : Number
		},
		//countriesAllowedToShip : []
		percentToCharity : {
			type : Number
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