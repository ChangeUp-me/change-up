(function () {
  CharitiesSchema = new SimpleSchema({
		name : {
			type : String,
			max : 28
		},
		image : orion.attribute('image', {
	    optional: true,
	    label: 'Image',
	  }),
		description : {
			type : String,
			defaultValue : '',
			max : 254
		},
		about : {
			type : String,
			defaultValue : '',
			optional : true
		},
		category : {
			type : String,
			defaultValue : '',
			max : 38
		},
		websiteLink : {
			type : String,
			optional : true,
		}
	})
	
	Charities.attachSchema(CharitiesSchema);
})();
