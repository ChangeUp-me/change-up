LikesSchema = new SimpleSchema({
	productId : {
		type : String
	},
	userId : {
		type : String
	},
	timestamp : {
		type : String,
		defaultValue : Date.now
	},
	vendorId : {
		type : String
	}
})