/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Login.events({
	'submit #loginForm' : function (event) {
		event.preventDefault();

		var form = event.target;
		var user = {email : form.email.value};
		var password = form.password.value;

		Meteor.loginWithPassword(user, password, function login_user (error) {
			if(error){
				console.error(error);
				return sAlert.error("we couldn't log you in with those credentials");
			}

			Router.go('shop');
		});
	}
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({
});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.onCreated(function () {
});

Template.Login.onRendered(function () {
});

Template.Login.onDestroyed(function () {
});
