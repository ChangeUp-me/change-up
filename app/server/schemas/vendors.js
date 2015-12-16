(function() {
  VendorSchema = new SimpleSchema({
  	userId : {
  		type : String,
  		unique : true
  	},
    image: {
      type: Object,
      optional: true,
      blackbox: true
    },
    websiteUrl: {
      type: String,
      optional: true
    },
    storeName: {
      type: String,
      unique : true
    },
    storeDescription: {
      type: String,
      defaultValue: ''
    },
    vendorName: {
      type: String
    },
    about: {
      type: String,
      defaultValue: ''
    },
    orders: {
      type: [orders_schema()],
      optional: true
    },
    charities: {
      type: [String],
      optional: true,
    },
    unseenOrders: {
      type: Array,
      optional: true,
    },
    "unseenOrders.$": {
      type: Object,
      optional: true,
      blackbox: true
    },
    "unseenOrders.$.transactionId": {
      type: String,
      optional: true
    }
  });

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
})();

