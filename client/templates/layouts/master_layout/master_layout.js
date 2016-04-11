Template.MasterLayout.events({
	'submit [data-submit-signupToLike]' : function (event) {
		event.preventDefault();

		var form = event.target;
		var user = {email : form.email.value};
		var password = form.password.value;
		var confirmPassword = form.confirmPassword.value;
		var email = form.email.value;


		var likeThis = Session.get('autoLike') || {};

		if(!password) return sAlert.error('please enter a password');

		if(password !== confirmPassword) return sAlert.error("your passwords don't match");

		if(!email) return sAlert.error('please enter a valid email');

		Meteor.call('insertUser',{
			email : email,
			password : password,
			profile : {
				dateRegistered : Date.now()
			}
		}, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error("The Signup Failed");
			}
			Meteor.loginWithPassword(email, password, function (err) {
				if(err) {
					console.error(err);
					return sAlert.error('we could not log you in');
				}

				sAlert.success("you've been signed up!");

				//automatically like product
				Meteor.call('addLike', likeThis.id, likeThis.vendor, function (err, result){
					if(err){
						console.error(err);
					}
				})
			})
		});
	},
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
			$('#cart').removeClass('show-cart');
		} else {
			// Do things on Nav Open
			$('#cart').addClass('show-cart');
			$('#site-wrapper').addClass('show-cart');
			$('#overlay').addClass('show');
		}
	},
	'click #overlay': function() {
		$('#cart').removeClass('show-cart');
		$('#site-wrapper').removeClass('show-nav');
		$('#site-wrapper').removeClass('show-cart');
		$('#overlay').removeClass('show');
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