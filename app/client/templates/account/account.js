/*****************************************************************************/
/* Account: Event Handlers */
/*****************************************************************************/
Template.Account.events({
	'click #accountSave' : function () {

		function validEmail(v) {
			var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
			return (v.match(r) == null) ? false : true;
		}

		var name = $('#accountName').val();
		var email = $('#accountEmail').val();
		var phone = $('#accountPhone').val();

		if (!validEmail(email)) {
			return sAlert.error('Invalid email address');
		}

		if (name.length < 3) {
			return sAlert.error('Name must be atleast 3 letters long');
		}

		var intRegex = /[0-9 -()+]+$/;
		if((phone.length < 10) || (!intRegex.test(phone))) {
			return sAlert.error('Please enter a 10 digit phone number');;
		}


		var accountObject = {
			'name' : name,
			'email' : email,
			'phone' : phone
		};

		Meteor.call('updateAccount', accountObject, function(err, data) {
			if (err) {
				sAlert.error('Email address taken by someone else, try a different address.');
			} else {
				sAlert.success('Account details saved!');
			}
		});
	},
	'click #paymentSave' : function () {
		var shippingName = $('#shippingName').val();
		var shippingStreet = $('#shippingStreet').val();
		var shippingCity = $('#shippingCity').val();
		var shippingState = $('#shippingState').val();
		var shippingZip = $('#shippingZip').val();
		var billingName = $('#billingName').val();
		var billingStreet = $('#billingStreet').val();
		var billingCity = $('#billingCity').val();
		var billingState = $('#billingState').val();
		var billingZip = $('#billingZip').val();

		var accountObject = {
			'shippingName' : shippingName,
			'shippingStreet' : shippingStreet,
			'shippingCity' : shippingCity,
			'shippingState' : shippingState,
			'shippingZip' : shippingZip,
			'billingName' : billingName,
			'billingStreet' : billingStreet,
			'billingCity' : billingCity,
			'billingState' : billingState,
			'billingZip' : billingZip
		};

		Meteor.call('updateBilling', accountObject, function(err, data) {
			if (err) {
				sAlert.error('Error saving details, try again later.');
			} else {
				sAlert.success('Billing details saved!');
			}
		});
	}
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
