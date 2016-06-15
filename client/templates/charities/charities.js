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
		return Charities.find().fetch();
	}
});

/*****************************************************************************/
/* Charities: Lifecycle Hooks */
/*****************************************************************************/
Template.Charities.onCreated(function () {
	$("title").text("Charities | ChangeUp");

});

Template.Charities.onRendered(function () {
});

Template.Charities.onDestroyed(function () {
	$("title").text("ChangeUp");

});
