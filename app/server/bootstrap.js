Meteor.startup(function () {
	if(Meteor.users.find().count() < 2) {
		var userId = Accounts.createUser({
	    profile: {
	      name: 'jack',
	      dateRegistered : Date.now()
	    },
	    email: "jackj@example.com",
	    password: "password",
	  });
		Roles.setUserRoles(userId, ['user', 'vendor', 'admin']);
	}
	return;
	Stripe.setPublishableKey('YOUR_PUBLISHABLE_KEY');
	var handler = StripeCheckout.configure({
     key: 'YOUR_PUBLISHABLE_KEY',
     token: function(token) {}
  });
});
