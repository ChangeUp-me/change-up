Meteor.startup(function () {
	//smtp
	process.env.MAIL_URL = "smtp://terrell.changeup@gmail.com:changeup1234@smtp.gmail.com:587";

	var superUser = Meteor.users.findOne({'emails.address' : 'geoff.bruskin@changeup.me'});

	//create an admin if there is none
	if(!superUser) {
		try {
			var id = Accounts.createUser({
				email : "geoff.bruskin@changeup.me",
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

	// Add default charity
	if (Charities.find().count() === 0) {
		var charity = {
			about: "Our mission is to bring clean and safe drinking water to every person in the world",
			category: "Water",
			description: "Charity: Water builds clean water drinking wells in developing nations around the world. 100% of all proceeds raised go directly to the field.",
			image: {
				fileId: "BEFfMLhpGpNYjCqKe",
				url: "https://s3-us-west-2.amazonaws.com/change-up/orionjs/02a7c014-93a1-4a98-9e79-b9cc7076599c.jpg",
				info: {
					backgroundColor: "#241e20",
					height: 600,
					primaryColor: "#fec907",
					secondaryColor: "#fefcfe",
					width: 600
				}
			},
			name: "Charity Water",
			websiteLink: "https://donate.charitywater.org/donate/home"
		};
		Charities.insert(charity);
	}
});

// Meteor.settings.private.stripe.apiKey = 'sk_test_ktIiEvAZc1rW3e1Q4clVi0OC';

S3.config = {
	key: 'AKIAIT4YEBGC7OQX2C5A',
	secret: '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',
	bucket: 'change-up',
	region : 'us-west-2'
};
