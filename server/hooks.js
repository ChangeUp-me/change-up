(function () {
	//send a newly created vendor an email
	Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {
		var updateObj = modifier.$set;

		try {
			if(_.isObject(updateObj) && _.isArray(updateObj.roles)) {
				if(updateObj.roles.indexOf('vendor') > -1) {
					Email.send({
						to : doc.emails[0].address,
						from : 'hello@changeup.me',
						subject : 'Setup Your Vendor Account!',
						text : "A vendor account has been made for you on ChangeUp.me. To set up your store, login at http://www.changeup.me/login with your username and password. Then go to http://www.changeup.me/vendorProfile to create your store!"
					});
				}
			}
		} catch (e) {
			console.error('send-vendor-email', e.stack);
		}
	});

	/**
	* Do that after the admin confirms a request from a user.  Typical requests involve
	* a user asking to become a vendor.
	*/
	accessRequests.after.update(function (userId, doc, fieldNames, modifier, options) {
		if(modifier.$set && modifier.$set.confirm) {
			var user = Meteor.users.findOne(doc.userId);

			if(user && doc.requestType == 'vendor') {
				var roles = user.roles || [];
				roles.push('vendor');

				//give the user vendor access
				Roles.setUserRoles(user._id, roles);
			}
		}
	});
})();
