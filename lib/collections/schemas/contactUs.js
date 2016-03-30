ContactUs.attachSchema(new SimpleSchema({
	date: {
		type: Date,
		label : "Date",
		autoValue : function () {
			if(this.isInsert || this.isUpdate) {
				return new Date();
			} else {
				this.unset();
			}
		}
	},
	name: {
		type: String,
		label : "Name",
		optional: false
	},
	email: {
		type: String,
		label: "Email",
		optional: false
	},
	message: {
		type: String,
		label: "Message",
		optional: false
	}
}));
