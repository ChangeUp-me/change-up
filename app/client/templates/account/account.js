/*****************************************************************************/
/* Account: Event Handlers */
/*****************************************************************************/
Template.Account.events({
});

/*****************************************************************************/
/* Account: Helpers */
/*****************************************************************************/
Template.Account.helpers({
	account : function () {
		var user = Meteor.users.findOne();
		user.email = user.emails[0].address;
		return user;
	}
});

/*****************************************************************************/
/* Account: Lifecycle Hooks */
/*****************************************************************************/
Template.Account.onCreated(function () {
});

Template.Account.onRendered(function () {
});

Template.Account.onDestroyed(function () {
});
