var ordersSchema = new SimpleSchema({
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

var transactionSchema = new SimpleSchema({
	transactionId : {
		type : String
	}
})

var profileSchema = new SimpleSchema({
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
		type : ordersSchema
	},
	unseenOrders : {
		type : [transactionSchema]
	},
	profile : {
		type : profileSchema
	}
});