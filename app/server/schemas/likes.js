(function () {
	LikesSchema = new SimpleSchema({
		productId : {
			type : String
		},
		userId : {
			type : String
		},
		timestamp : {
			type : String,
			autoValue : function () {
				if(this.isInsert) {
					return new Date();
				} else {
					this.unset();
				}
			}
		},
		vendorId : {
			type : String
		}
	})

	Likes.attachSchema(LikesSchema);
})();