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

			Meteor.setTimeout(function () {
				var user = Meteor.user();
				if(user.profile.vendorId) {
					Router.go('vendorProducts')
				} else {
					Router.go('shop');
				}
			}, 500)
		});
	},
	'click #facebook' : function login_with_facebook (event) {
		event.preventDefault();

		Meteor.loginWithFacebook({
			requestPermissions : ['public_profile', 'email'],
			loginStyle : 'popup'
		}, function(err){
      if (err) {
      	console.error(err);
       return sAlert.error(err);
      }

      Meteor.setTimeout(function () {
				var user = Meteor.user();
				if(user.profile.vendorId) {
					Router.go('vendorProducts')
				} else {
					Router.go('shop');
				}
			}, 500)
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
