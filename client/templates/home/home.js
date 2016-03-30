/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
	'click #facebook' : function login_with_facebook (event) {
		event.preventDefault();

		Meteor.loginWithFacebook({
			requestPermissions : ['public_profile', 'email'],
			loginStyle : 'popup'
		}, function(err){
      if (err) {
      	console.error(err);
       return sAlert.error("Facebook login failed");
      }

      Router.go('shop')
    });
	},
	'click #twitter' : function login_with_twitter (event) {
		event.preventDefault();

		Meteor.loginWithTwitter({
			loginStyle : 'popup'
		}, function(err){
      if (err) {
      	console.error(err);
        return sAlert.error("Twitter login failed");
      }
      Router.go('shop');
    });
	}
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function () {
});

Template.Home.onRendered(function () {
});

Template.Home.onDestroyed(function () {
});
