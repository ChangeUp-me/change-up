/*****************************************************************************/
/* Register: Event Handlers */
/*****************************************************************************/
Template.Register.events({
	'submit #register_form' : function (event, something) {
		event.preventDefault();

		var form = event.target;
		var password = form.password.value;
		var email = form.email.value;

		Meteor.call('insertUser',{
			email : email,
			password : password,
			profile : {
				name : form.name.value,
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

				Router.go('shop');
			})
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

      Router.go('shop')
    });
	}
});

/*****************************************************************************/
/* Register: Helpers */
/*****************************************************************************/
Template.Register.helpers({
});

/*****************************************************************************/
/* Register: Lifecycle Hooks */
/*****************************************************************************/
Template.Register.onCreated(function () {
});

Template.Register.onRendered(function () {
});

Template.Register.onDestroyed(function () {
});
