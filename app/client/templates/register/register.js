/*****************************************************************************/
/* Register: Event Handlers */
/*****************************************************************************/
Template.Register.events({
	'submit #register_form' : function (event, something) {
		event.preventDefault();

		var form = event.target;

		Meteor.call('insertUser',{
			email : form.email.value,
			password : form.password.value,
			profile : {
				name : form.name.value,
				dateRegistered : Date.now()
			}
		}, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error("The Signup Failed");
			}
			Router.go('shop');
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
