/*****************************************************************************/
/* Charities: Event Handlers */
/*****************************************************************************/
Template.Charities.events({
});

/*****************************************************************************/
/* Charities: Helpers */
/*****************************************************************************/
Template.Charities.helpers({
	charities : function () {
		console.log(Charities.find().fetch());
		return Charities.find().fetch();
	}
});

/*****************************************************************************/
/* Charities: Lifecycle Hooks */
/*****************************************************************************/
Template.Charities.onCreated(function () {
});

Template.Charities.onRendered(function () {
});

Template.Charities.onDestroyed(function () {
});
