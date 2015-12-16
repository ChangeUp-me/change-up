(function () {
	ContactMessagesSchema = new SimpleSchema({
		name : {
			type : String,
		},
		email : {
			type : String
		},
		body : {
			type : String
		}
	})

	ContactMessages.attachSchema(ContactMessagesSchema);
})();