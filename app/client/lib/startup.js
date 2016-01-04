Meteor.startup(function () {
	Stripe.setPublishableKey('pk_bohRkRD79OI8j8wJgB2KAiWEjO3D7');
	var handler = StripeCheckout.configure({
     key: 'pk_bohRkRD79OI8j8wJgB2KAiWEjO3D7',
     token: function(token) {}
  });
});
