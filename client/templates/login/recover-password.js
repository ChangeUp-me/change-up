Template.RecoverPassword.events({
	'submit #passwordRecover' : function (event) {
		event.preventDefault();

		var resetToken = Session.get('passwordRecoverToken');
		var form = event.target;
		var password = form.password.value;
		var confirmPassword = form.confirmPassword.value;

		if(password !== confirmPassword) return sAlert.error('you entered two different passwords');

		if(!resetToken) return sAlert.error('no reset token given');

		Accounts.resetPassword(resetToken, password, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error('your password could not be reset');
			}

			sAlert.success('pasword successfully reset');

			Router.go('shop');
		})	
	}
});


/*****************************************************************************/
/* RecoverPassword: Helpers */
/*****************************************************************************/
Template.RecoverPassword.helpers({
});

/*****************************************************************************/
/* RecoverPassword: Lifecycle Hooks */
/*****************************************************************************/
Template.RecoverPassword.onCreated(function () {
});

Template.RecoverPassword.onRendered(function () {
	$('#forgotaccount').hide();
});

Template.RecoverPassword.onDestroyed(function () {
});
