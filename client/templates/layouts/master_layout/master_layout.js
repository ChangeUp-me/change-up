Template.MasterLayout.events({
	'submit [data-submit-emailsubscribe]' : function (event) {
		event.preventDefault();

		var form = event.target;
		var email = form.email.value;

		if(!email) {
			return sAlert.error('please enter your email');
		}

		sAlert.info("hold on we're attempting to sign you up");

		Meteor.call('email_subscribe',  email, function (err, result) {
			if(err) {
				console.error(err);
				return sAlert.error("we couldn't subscribe you");
			}

			console.log('teh result', result);

			sAlert.success("you're all signed up!")
			Cookie.set('subscriber', 'subscribed')

			$('#signupmodal').modal('hide');
		})
	},
  'click .toggle-cart' : function () {
		if ($('#site-wrapper').hasClass('show-cart')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-cart');
		} else {
			// Do things on Nav Open
			$('#site-wrapper').addClass('show-cart');
		}
	}
});


Template.MasterLayout.onRendered(function () {
	//show popup to a user X seconds after they first land on the site
	var subscribed = Cookie.get('subscriber');

	if(!Meteor.user() && !subscribed) {

		$('#popup_close').on('click', function () {
			$('#signupmodal').modal('hide');
		})

		Meteor.setTimeout(function () {
			$('#signupmodal').modal('show');
		},30000);
	}
})