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
		},
		price : {
			type : Number,
		},
		currency : {
			type : String,
			defaultValue : 'usd'
		},
		reviews : {
			type : [review_schema()]
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
		likeCount : {
			type : Number,
			defaultValue : 0
		},
		dealEndDate : {
			type : Date,
			autoValue : function () {
				if(this.isInsert) {
					return new Date();
				} else {
					this.unset();
				}
			}
		},
		details : {
			type : String
		},
		image : {
			type : Object,
			blackbox: true
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