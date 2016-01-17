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

Template.Orders.helpers({
	index : function (indx) {
		return (parseInt(indx) || 0) + 1;
	},
	totals : function () {
		var orderTotal = 0;
		var subTotal = 0;
		var shippingPrice = 0;

		try{
			var orders = this.order;

			var o;
      for(var i = 0; i < orders.length; i++) {
        o = orders[i];
        subTotal = subTotal +  (parseFloat(o.price) *  o.quantity);
        shippingPrice = parseFloat(o.shippingPrice);
      }
		} catch (e) {
			console.error(e.stack);
		}

		return {
			total : (subTotal + shippingPrice).toFixed(2),
			subTotal : subTotal.toFixed(2),
			shipping : shippingPrice.toFixed(2),
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
