(function () {
	//send a newly created vendor an email
	Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {
		var updateObj = modifier.$set;
		var user = Meteor.users.findOne(doc._id);

		try {
			if(_.isObject(updateObj) && _.isArray(updateObj.roles)) {
				if(updateObj.roles.indexOf('vendor') > -1) {
					Email.send({
						to : user.emails[0].address,
						from : 'terrell.changeup@gmail.com',
						subject : 'Setup Your Vendor Account!',
						text : "You now have Vendor access. Log into changeup.com and go to changeup.com/vendorProfile to create your store!"
					});
				}
			} 
		} catch (e) {
			console.error('send-vendor-email', e.stack);
		}
	});

	//when a new user is created
	Accounts.onCreateUser(function (options, user) {
		var services = user.services;

		//if they login with facebook
		if(_.isObject(services) && _.isObject(services.facebook)) {
			var email = services.facebook.email || 'email@example.com';
			user.emails = [{address : email, verified : true}];
		}

		return user;
	});
})();