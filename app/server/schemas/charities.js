(function () {
	CharitiesSchema = new SimpleSchema({
		name : {
			type : String
		},
		image : {
			type : Object,
			blackbox: true
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