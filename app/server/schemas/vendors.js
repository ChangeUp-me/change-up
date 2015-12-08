(function () {
	VendorsSchema = new SimpleSchema({
		userId : {
			type : String
		},
		email : {
			type : String,
			max : 270
		},
		password : {
			type : String
		},
		storeName : {
			type : String
		},
		vendorName : {
			type : String
		},
		orders : {
			type : orders_schema()
		},
		unseenOrders : {
			type : [transaction_schema()]
		},
		profile : {
			type : profile_schema()
		}
	});

	Vendors.attachSchema(VendorsSchema);

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


	function profile_schema() {
		return new SimpleSchema({
			image : {
				type : Object
			},
			storeInfo : {
				type : String
			},
			businessName : {
				type : String
			},
			businessDescription : {
				type : String
			}
		});
	}

	function transaction_schema () {
		return new SimpleSchema({
			transactionId : {
				type : String
			}
		})
	}
})();

