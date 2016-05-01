//construct the charity statements
//and vendor statements
//every 2 days
SyncedCron.add({
	name : "construct vendor and charity statements",
	schedule : function (parser) {
		return parser.text('every 2 days');
	},
	job : function () {
		buildCharityStatements();
		buildVendorStatements();
	}
});


Meteor.startup(function () {
	//smtp
	process.env.MAIL_URL = "smtp://terrell.changeup@gmail.com:changeup1234@smtp.gmail.com:587";

	var superUser = Meteor.users.findOne({'emails.address' : 'geoff@changeup.me'});

	//create an admin if there is none
	if(!superUser) {
		try {
			var id = Accounts.createUser({
				email : "geoff@changeup.me",
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

	SyncedCron.start();

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

function buildCharityStatements () {
	var payments = new CHARITYPAYMENTS();
	var charities = Charities.find({}).fetch();
	var result = [];

	_.each(charities, function (charity) {
		Meteor.setTimeout(function () {
			var statements = payments.getStatement(charity._id);

			payments.saveStatements(charity._id, statements);

			console.log('charity statements', statements);
		})
	})
}

function buildVendorStatements () {
	var payments = new VENDORPAYMENTS();
	var vendors = Vendors.find({}).fetch();
	var result = [];

	_.each(vendors, function (vendor) {
		Meteor.setTimeout(function () {
			var statements = payments.getStatement(vendor._id);

			payments.saveStatements(vendor._id, statements);
			console.log('vendor statements', statements);
		})
	})
}


// Meteor.settings.private.stripe.apiKey = 'sk_live_rNjG94LGyl52oDz7ZMTCSilq';

S3.config = {
	key: 'AKIAIT4YEBGC7OQX2C5A',
	secret: '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',
	bucket: 'change-up',
	region : 'us-west-2'
};
