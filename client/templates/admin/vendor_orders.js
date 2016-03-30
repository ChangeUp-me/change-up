/*****************************************************************************/
/* VendorOrders: Event Handlers */
/*****************************************************************************/
Template.VendorOrders.events({
});

/*****************************************************************************/
/* VendorOrders: Helpers */
/*****************************************************************************/


Template.VendorOrders.helpers({
	vendorOrderSettings: function () {
		return {
			collection: Transactions,
			rowsPerPage: 10,
			showFilter: true,
			fields: [
				{
					key: 'order',
					label: 'Fulfilled',
					sortOrder: 0,
					sortDirection: 'descending',
					fn: function (value) {
						var tOF = true;
						var falseVal = 0;

						for (var i = 0; i < value.length; i++) {
							if (value[i].fulfilled === false) {
								falseVal ++;
							}
						}

						if (falseVal > 0) {
							tOF = false;
						}

						if (tOF === false) {
							return new Spacebars.SafeString("<button class=\"button orange\">Not Fulfilled</button>");
						} else if (tOF === true) {
							return new Spacebars.SafeString("<button class=\"button lightgray\">Fulfilled</button>");
						}
					}
				}, {
					key: 'timestamp',
					label: 'Date',
					sortOrder: 1,
					sortDirection: 'descending',
					fn: function (value) {
						return new Spacebars.SafeString(value.toLocaleDateString());
					}
				}, {
					key: 'transactionId',
					label: 'Transaction Id'
				}, {
					key: 'billing.creditCardName',
					label: 'Customer',
					fn: function (value) {
						return new Spacebars.SafeString(value);
					}
				}, {
					key: 'order',
					label: 'Total',
					fn: function (value) {
						var total = 0;
						try {
							for (var i = 0; 0 < value.length; i++) {
								total += ((value[i].price)*(value[i].quantity));
							}
						} catch (e) {

						}

						if (value[0].shippingPrice){
							total += Number(value[0].shippingPrice);
						}
						return new Spacebars.SafeString("$"+total);
					}
				}, {
					key: '_id',
					label: '',
					fn: function (value) {
						return new Spacebars.SafeString("<a href=\"fulfillment/"+value+"\">View Order</a>");
					}
				}
			]
		};
	},
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
	openOrders : function() {
		try {
			var transactions = this.transactions;
			var open = 0;

			for (var i = 0; i < transactions.length; i++) {
				value = transactions[i].order;
				var falseVal = 0;

				for (var x = 0; x < value.length; x++) {
					if (value[x].fulfilled === false) {
						falseVal ++;
					}
				}

				if (falseVal > 0) {
					open++;
				}
			}
			return open;
		} catch (e) {

		}
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
