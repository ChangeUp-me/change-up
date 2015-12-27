Meteor.startup(function () {
	return;
	Stripe.setPublishableKey('YOUR_PUBLISHABLE_KEY');
	var handler = StripeCheckout.configure({
     key: 'YOUR_PUBLISHABLE_KEY',
     token: function(token) {}
  });
});
