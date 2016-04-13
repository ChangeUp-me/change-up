(function () {
	var theSchema = accessSchema();

	if(Meteor.isClient) {
		theSchema.userId = orion.attribute('hasOne', {
	    type : String,
	    unique : true
	  }, {
	    collection : Meteor.users,
	    titleField : ['profile.name','emails.address', 'roles'],
	    publicationName : Random.id()
	  });
	}

	accessRequests.attachSchema(new SimpleSchema(theSchema));

	function accessSchema () {
		return {
			userId : {
				type : String,
			},
			requestType : {
				type : String,
				defaultValue : 'vendor'
			},
			confirm : {
				type : Boolean,
				defaultValue : false
			}
		};
	}
})();