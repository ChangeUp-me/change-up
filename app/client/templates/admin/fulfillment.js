/*****************************************************************************/
/* Fulfillment: Event Handlers */
/*****************************************************************************/
Template.Fulfillment.events({
});

/*****************************************************************************/
/* Fulfillment: Helpers */
/*****************************************************************************/
Template.Fulfillment.helpers({
	totals : function () {
		var shipping = 0;
		var total = 0;
		var order = this.order || [];
		var subTotal = 0;
		var tax = 2;

		order.forEach(function (item) {
			shipping = item.shippingPrice;
			total += parseFloat(item.price * item.quantity);
		});

		return {
			subTotal : parseFloat(Math.max(0, total - shipping - tax)).toFixed(2),
			shipping : parseFloat(shipping).toFixed(2),
			tax : parseFloat(tax).toFixed(2),
			total : parseFloat(total).toFixed(2)
		}
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
