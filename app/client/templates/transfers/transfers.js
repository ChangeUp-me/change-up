/*****************************************************************************/
/* Transfers: Event Handlers */
/*****************************************************************************/
Template.Transfers.events({
});

/*****************************************************************************/
/* Transfers: Helpers */
/*****************************************************************************/

//@todo - DON'T FORGET ABOUT STRIPES TRANSACTION FEES
Template.Transfers.helpers({
	totals : function () {
		var percToCharity = (this.percentToCharity || 5)/100;
		var percToVendor = 1 - percToCharity;
		var total = this.price * this.quantity;

		var vendorTotal = parseFloat((this.price * this.quantity) * percToVendor).toFixed(2)
		var charityTotal = parseFloat(total - parseFloat(vendorTotal)).toFixed(2);

		return {
			total : total,
			vendor : vendorTotal,
			charity : charityTotal,
			charityPerct : percToCharity * 100,
			vendorPerct : percToVendor * 100
		}
	}
});

/*****************************************************************************/
/* Transfers: Lifecycle Hooks */
/*****************************************************************************/
Template.Transfers.onCreated(function () {
});

Template.Transfers.onRendered(function () {
});

Template.Transfers.onDestroyed(function () {
});
