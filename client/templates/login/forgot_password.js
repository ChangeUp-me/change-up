Template.ForgotPassword.events({
	'submit #forgotPassword' : function (event) {
		event.preventDefault();

		var form = event.target;
		var email = form.email.value;

		if(!email) 
			return sAlert.error("you didn't give an email");

		Accounts.forgotPassword({email : email}, function (err) {
			if(err) {
				if(err.message == 'User not found [403]') {
					return sAlert.error('This email does not exist');
				} else {
					return sAlert.error('something went wrong');
				}
			}

			sAlert.success('email sent.  check your inbox.')
		});
	}
});


/*****************************************************************************/
/* ForgotPassword: Helpers */
/*****************************************************************************/
Template.ForgotPassword.helpers({
});

/*****************************************************************************/
/* ForgotPassword: Lifecycle Hooks */
/*****************************************************************************/
Template.ForgotPassword.onCreated(function () {
});

Template.ForgotPassword.onRendered(function () {
	$('#forgotaccount').hide();
});

Template.ForgotPassword.onDestroyed(function () {
});
