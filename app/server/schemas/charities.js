(function () {
	CharitiesSchema = new SimpleSchema({
		name : {
			type : String
		},
		image : {
			type : Object
		},
		description : {
			type : String
		},
		about : {
			type : String
		}
	})
	
	Charities.attachSchema(CharitiesSchema);
})();