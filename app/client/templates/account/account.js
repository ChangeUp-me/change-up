/*****************************************************************************/
/* Account: Event Handlers */
/*****************************************************************************/
Template.Account.events({
});

/*****************************************************************************/
/* Account: Helpers */
/*****************************************************************************/
Template.Account.helpers({});

Template.Orders.helpers({
	index : function (indx) {
		return (parseInt(indx) || 0) + 1;
	},
	totals : function () {
		var orderTotal = this.price;
		var subTotal = 0;
		var shippingPrice = 0;

		try{
			var orders = this.order;
			var o;
			for(var i = 0; i < orders.length; i++) {
				o = orders[i];
				subTotal = subTotal +  (parseFloat(o.price) *  o.quantity);
			}
		} catch (e) {
		}
		shippingPrice = orderTotal-subTotal;

		return {
			total : orderTotal,
			subTotal : subTotal.toFixed(2),
			shipping : shippingPrice
		};
	}
})

/*****************************************************************************/
/* Account: Lifecycle Hooks */
/*****************************************************************************/
Template.Account.onCreated(function () {
});

Template.Account.onRendered(function () {
});

Template.Account.onDestroyed(function () {
});
