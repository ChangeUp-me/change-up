(function () {
	if(Meteor.isServer) {
		Products.attachSchema(new SimpleSchema(productSchema()));
	} else if(Meteor.isClient) {
		var schema = productSchema();
		schema = _.omit(schema, ['reviews', 'sizes', 'likeCount', 'quantity']);

		schema.vendorId = orion.attribute('hasOne', {
			type : String,
			unique : true
		}, {
			collection : Vendors,
			titleField : ['storeName'],
			publicationName : Random.id(),
		})

		Products.attachSchema(new SimpleSchema(schema));
	}

	return Products;


	function productSchema () {
		return {
			vendorId: {
				type: String,
			},
			name: {
				type: String,
			},
			description: {
				type: String,
				optional: true
			},
			price: {
				type: String
			},
			currency: {
				type: String,
				defaultValue: 'usd'
			},
			reviews: {
				type: [review_schema()],
				optional: true
			},
			quantity: {
				type: Number,
				defaultValue: 0
			},
			sizes: {
				type: [String],
				optional: true,
				defaultValue: []
			},
			oneSize: {
				type: Boolean,
				optional: true,
				defaultValue: false
			},
			details: {
				type: String,
				optional: true
			},
			image : orion.attribute('image', {
	      optional: true,
	      label: 'Photo Url'
	    }),
	    images : orion.attribute('images', {
	      optional: true,
	      label: 'Photo Urls'
	    }),
			shippingPrice: {
				type: String,
				defaultValue: '0.0'
			},
			//countriesAllowedToShip : []
			percentToCharity: {
				type: Number,
				defaultValue: 5
			},
			deleted: {
				type: Boolean,
				defaultValue: false
			},
			likeCount: {
				type: Number,
				defaultValue: 0
			},
			/*shippingFrom : {
				type : shipping_from_schema(),
				optional : true
			},
			parcelInfo : {
				type : parcel_info_schema(),
				optional : true
			}*/
		}
	}

	function shipping_from_schema() {
		return new SimpleSchema({
			street : {
				type : String
			},
			city : {
				type : String,
			},
			zipcode : {
				type : String
			},
			country : {
				type : String
			},
			state : {
				type : String
			}
		});	
	}

	function parcel_info_schema () {
		return new SimpleSchema({
			carrier : {
				type : String
			},
			weight : {
				type : String
			},
			length : {
				type : String
			},
			width : {
				type : String
			},
			height : {
				type : String
			},
			massUnit : {
				type : String
			},
			distanceUnit : {
				type : String
			}
		});
	}

	function review_schema() {
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
			rating: {
				type: Number
			},
			title: {
				type: String,
				optional: true
			},
			name: {
				type: String,
				optional: true
			},
			userId: {
				type: String
			},
			timestamp: {
				type: Date,
				autoValue : function () {
					if(this.isInsert || this.isUpdate) {
						return new Date();
					} else {
						this.unset();
					}
				}
			},
			comment: {
				type: String,
				optional: true
			}
		})
	}
})();
