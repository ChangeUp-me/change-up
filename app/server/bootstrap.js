Meteor.startup(function () {
	//smtp
	process.env.MAIL_URL = "smtp://terrell.changeup@gmail.com:changeup1234@smtp.gmail.com:587";

	var superUser = Meteor.users.findOne({'emails.address' : 'admin@changeup.com'});

	//create an admin if there is none
	if(!superUser) {
		try {
			var id = Accounts.createUser({
				email : "admin@changeup.com",
				password : "changeup1234",
				profile : {
					name : "admin",
					dateRegistered : Date.now()
				}
			});

			Roles.setUserRoles(id, ['user', 'admin', 'vendor']);
		} catch (e) {
			console.error('super-user-creation', e);
		}
	}
});

S3.config = {
    key: 'AKIAIT4YEBGC7OQX2C5A',
    secret: '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',
    bucket: 'change-up',
    region : 'us-west-2'
};
