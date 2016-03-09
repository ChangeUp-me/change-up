/*****************************************************************************/
/* Fulfillment: Event Handlers */
/*****************************************************************************/
Template.Fulfillment.events({
	"click [data-click-fulfill]" : function (event) {
		var ids = _.pluck(this.order, 'orderId');
		console.log("hello");

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
		console.log(this);
		var shipping = 0;
		var total = 0;
		var order = this;
		var subTotal = 0;

		order.forEach(function (item) {
			subTotal += parseFloat(item.price * item.quantity);
		});

		return {
			subTotal : parseFloat(subTotal).toFixed(2),
			shipping : parseFloat(shipping).toFixed(2),
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
