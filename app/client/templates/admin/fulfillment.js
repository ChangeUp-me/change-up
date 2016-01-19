/*****************************************************************************/
/* Fulfillment: Event Handlers */
/*****************************************************************************/
Template.Fulfillment.events({
	"click [data-click-fulfill]" : function (event) {
		var ids = _.pluck(this.order, 'orderId');

		Meteor.call('fulfillOrder', ids, function (err) {
			if(err){
				console.error(err);
				return sAlert.error('order could not be fulfilled');
			}

			sAlert.success('order fulfilled');
		});
	}
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
	},
	isFulfilled : function () {
		var unfulfilledItems = [];
		var order = this.order || [];

		//check if there are any unfulfilled items
		order.forEach(function (item) {
			if(item.fulfilled == false) {
				unfulfilledItems.push('false')
			}
		});

		return unfulfilledItems.length > 0 ? false : true;
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
