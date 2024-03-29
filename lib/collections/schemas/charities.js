(function () {
  CharitiesSchema = new SimpleSchema({
		name : {
			type : String,
			max : 32
		},
		image : orion.attribute('image', {
	    optional: true,
	    label: 'Image',
	  }),
		description : {
			type : String,
			defaultValue : '',
			max : 256
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
