//construct the charity statements
//and vendor statements
//every day
SyncedCron.add({
	name : "construct vendor and charity statements",
	schedule : function (parser) {
		return parser.text('every 1 days');
	},
	job : function () {
		buildCharityStatements();
		buildVendorStatements();
	}
});

//shedule automatic payment transfers
//WARNING - This function should only be used on the live server!
//simply uncomment the next line to set the transfer for every 2 weeks
//autoPayoutVendors();

Meteor.startup(function () {
	//smtp
	process.env.MAIL_URL = "smtp://postmaster@changeup.me:1c5a33d81cc742b9e3f0a38e9a3ff406@smtp.mailgun.org:587";

	var user = Meteor.users.findOne({'emails.address' : 'taweavr1@sbcglobal.net'});

	//reset password/link
	Accounts.emailTemplates.resetPassword.text = function(user, url) {
		url = url.replace('/#', '');
		var greeting = user.profile && user.profile.name ? "Hello " + user.profile.name + "," : "Hello,";    
		return greeting + "\n\nTo reset your password, simply click the link below.\n\n" + url + "\n\nThanks.\n";
	}

	var superUser = Meteor.users.findOne({'emails.address' : 'geoff@changeup.me'});

	//add the categories if there is none
	if(Categories.find().count() < 1) {
		addCategories(CATEGORIES);
		console.log('adding categories')
	}

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

			payments.saveStatements(charity._id, statements, charity.name);

			//console.log('charity statements', statements);
		})
	})
}

/**
* Add the categories and subcategories to the db
*/
function addCategories (categories) {
	_.each(categories, function (obj, key) {
		Categories.insert({
			name : key,
			subcategories : obj.subcategories
		});
	});
}

function buildVendorStatements () {
	var payments = new VENDORPAYMENTS();
	var vendors = Vendors.find({}).fetch();
	var result = [];

	_.each(vendors, function (vendor) {
		Meteor.setTimeout(function () {
			var statements = payments.getStatement(vendor._id);

			payments.saveStatements(vendor._id, statements, vendor.storeName);
			//console.log('vendor statements', statements);
		})
	})
}

/**
* Automatically payout money to vendors
* on a specific date
*
*/
function autoPayoutVendors () {
	var vendorpay = new VENDORPAYMENTS();

	vendorpay.scheduleTransfer();
}

// Meteor.settings.private.stripe.apiKey = 'sk_live_rNjG94LGyl52oDz7ZMTCSilq';

S3.config = {
	key: 'AKIAIT4YEBGC7OQX2C5A',
	secret: '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',
	bucket: 'change-up',
	region : 'us-west-2'
};
