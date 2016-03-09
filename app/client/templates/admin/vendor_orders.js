/*****************************************************************************/
/* VendorOrders: Event Handlers */
/*****************************************************************************/
Template.VendorOrders.events({
});

/*****************************************************************************/
/* VendorOrders: Helpers */
/*****************************************************************************/


Template.VendorOrders.helpers({
	myOrders : function () {
		return Transactions.find().fetch();
	},
	settings: function () {
		return {
			collection: Transactions,
			rowsPerPage: 10,
			showFilter: true,
			fields: [
				{
					key: 'order.0.fulfilled',
					label: 'Fulfilled',
					sortOrder: 0,
					sortDirection: 'descending',
					fn: function (value) {
						if (value === false) {
							return new Spacebars.SafeString("<button class=\"button orange\">Not Fulfilled</button>");
						} else if (value === true) {
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
					key: 'price',
					label: 'Total',
					fn: function (value) {
						return new Spacebars.SafeString("$"+value);
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
		//return Transactions.find({$and: [{'order.vendorId': Meteor.user().profile.vendorId},{'order.fulfilled':false}]}).count();
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
