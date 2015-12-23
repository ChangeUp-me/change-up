(function () {
	LikesSchema = new SimpleSchema({
		productId : {
			type : String
		},
		userId : {
			type : String
		},
		timestamp : {
			type : Date,
			autoValue : function () {
				if(this.isInsert || this.isUpsert) {
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