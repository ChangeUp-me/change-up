/*****************************************************************************/
/* Fulfillment: Event Handlers */
/*****************************************************************************/
Template.Fulfillment.events({
	"click [data-click-cancel]" : function (event) {
		var ids = _.pluck(this.order, 'orderId');

		Meteor.call('cancelOrder', this._id, ids, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error('order could not be cancelled');
			}
			Meteor.setTimeout(function () {
				Router.go('vendorOrders');
			},1000)
			sAlert.success('order cancelled');
		})
	},
	"click [data-click-fulfill]" : function (event) {
		var ids = _.pluck(this.order, 'orderId');

		Meteor.call('fulfillOrder', this._id, ids, function (err) {
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
		try {
			var shipping = 0;
			var total = 0;
			var order = this.order;
			var subTotal = 0;

			for (var i = 0; i < order.length; i++) {
				subTotal += parseFloat(order[i].price * order[i].quantity);
			}

			if (order[0].shippingPrice){
				shipping = Number(order[0].shippingPrice);
			}

			subTotal = parseFloat(subTotal).toFixed(2);
			shipping = parseFloat(shipping).toFixed(2);
			total = parseFloat(Number(subTotal)+Number(shipping)).toFixed(2);

			return {
				"subTotal" : subTotal,
				"shipping" : shipping,
				"total" : total
			}
		} catch (e) {

		}
	},
	isFulfilled : function () {
		try {
			var order = this.order;
			var tOF = true;
			var falseVal = 0;

			for (var i = 0; i < order.length; i++) {
				if (order[i].fulfilled === false) {
					falseVal ++;
				}
			}

			if (falseVal > 0) {
				tOF = false;
			}

			return tOF === false ? false : true;
		} catch (e) {

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
