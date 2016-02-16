/*****************************************************************************/
/* VendorOrders: Event Handlers */
/*****************************************************************************/
Template.VendorOrders.events({
});

/*****************************************************************************/
/* VendorOrders: Helpers */
/*****************************************************************************/


Template.VendorOrders.helpers({
	total : function () {
		var total = 0;
		_.each(this.order, function (item) {
			total += (parseFloat(item.price) * item.quantity);
		})
		return parseFloat(total).toFixed(2);
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
	},
	count : function() {
		var incomplete = 0;
		var transactions = this.transactions || [];

		transactions.forEach(function(t) {
			t.order.forEach(function (item) {
				if(item.fulfilled == false) {
					incomplete++;
				}
			});
		});
		
		return incomplete;
	}
});

/*****************************************************************************/
/* VendorOrders: Lifecycle Hooks */
/*****************************************************************************/
Template.VendorOrders.onCreated(function () {
});

Template.VendorOrders.onRendered(function () {
});

Template.VendorOrders.onDestroyed(function () {
});
