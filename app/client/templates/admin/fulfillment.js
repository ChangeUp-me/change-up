/*****************************************************************************/
/* Fulfillment: Event Handlers */
/*****************************************************************************/
Template.Fulfillment.events({
});

/*****************************************************************************/
/* Fulfillment: Helpers */
/*****************************************************************************/
Template.Fulfillment.helpers({
	subTotal : function () {
		return parseFloat(this.price) - 6 - 2;
	}
});

/*****************************************************************************/
/* Fulfillment: Lifecycle Hooks */
/*****************************************************************************/
Template.Fulfillment.onCreated(function () {
});

Template.Fulfillment.onRendered(function () {
});

Template.Fulfillment.onDestroyed(function () {
});
