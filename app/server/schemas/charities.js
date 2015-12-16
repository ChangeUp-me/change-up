(function () {
	CharitiesSchema = new SimpleSchema({
		name : {
			type : String
		},
		image : {
			type : Object,
			blackbox: true,
			optional : true
		},
		description : {
			type : String,
			defaultValue : ''
		},
		about : {
			type : String,
			defaultValue : ''
		},
		category : {
			type : String,
			defaultValue : ''
		},
		websiteLink : {
			type : String,
			optional : true,
		}
	})
	
	Charities.attachSchema(CharitiesSchema);
})();