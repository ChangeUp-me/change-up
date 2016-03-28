Template.MasterLayout.events({
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
	if(!Meteor.user() && !Cookie.get('signup_popup')) {
		Cookie.set('signup_popup', 'popped')

		$('#popup_login').on('click', function () {
			$('#signupmodal').modal('hide');
		})

		Meteor.setTimeout(function () {
			$('#signupmodal').modal('show');
		},7000);
	}
})