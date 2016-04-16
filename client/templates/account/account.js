/*****************************************************************************/
/* Account: Event Handlers */
/*****************************************************************************/
Template.Account.events({
	'click #new-bank': function () {
		$('#bank-input').removeClass('hidden');
		$('#bank-update').addClass('hidden');
	},
	'click #vendor-request' : function () {
		Meteor.call('requestVendorAccess', function (err) {
			if(err) {
				console.error(err);
				return sAlert.error('failed to send vendor request');
			}

			sAlert.success('vendor access request sent');
		});
	},
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
	},
	'click #saveBankInfo':function(event, temp){
		event.preventDefault();

		var routing = $("#routingNumber").val().trim();
		var account = $("#accountNumber").val().trim();

		if(!routing){
			$("#routingNumber").focus();
			$("#routingHelp").css({'color':"red"});
			$("#routingHelp").text("Routing Number is required");
		}
		else if(!account){
			$("#accountNumber").focus();
				$("#accountHelp").css({'color':"red"});
				$("#accountHelp").text("Account Number is required");
		}else{
			$(".help-block").empty();

			Stripe.bankAccount.createToken({
   			country: 'US',
			  routingNumber: routing,
			  accountNumber: account,
			}, function(status, response) {
			   if (!response.error){
			       Meteor.call('vendorPayout', response.id, function(error) {
							 if(!error){
								 sAlert.success("Bank Account Information Updated!");
								 $('#bank-input').addClass('hidden');
						 		$('#bank-update').removeClass('hidden');
							 }
						 })
			   } else {
					 sAlert.error(response.error);
				 }
			});
		}
	},
	'change .bankAccountInfo':function(e){
		var value = $(e.currentTarget).val().trim();
		var id = $(e.currentTarget).attr('id');
		var routing = id.indexOf('ting');
		var account = id.indexOf('account');

		if(account === 0){
			if(value != ""){
				$("#accountHelp").empty();
			}else {
				$("#accountNumber").focus();
					$("#accountHelp").css({'color':"red"});
					$("#accountHelp").text("Account Number is required");
			}
		}

		if(routing === 3){
			if(value != ""){
				$("#routingHelp").empty();
			}else {
				$("#routingNumber").focus();
					$("#routingHelp").css({'color':"red"});
					$("#routingHelp").text("Routing Number is required");
			}
		}

	}
});

/*****************************************************************************/
/* Account: Helpers */
/*****************************************************************************/
Template.Account.helpers({
	vendorRequestSent : function () {
		var request = accessRequests.findOne({
			userId : Meteor.userId(),
			requestType : 'vendor'
		})

		var hasRequest = request ? true : false;

		console.log(request, 'requests');

		return hasRequest;
	},
	vendorRequestApproved : function () {
		var request = accessRequests.findOne({
			userId : Meteor.userId(),
			requestType : 'vendor'
		})

		request = request || {};

		var approved = request.confirm;

		return approved;
	},
	isVendor:function(id){
		if(Roles.userHasRole(id, 'vendor')){
			return true;
		}else {
			return false;
		}
	},
	haveVendorBank:function(){
		//throws an error if the user hasn't setup
		//a bank account yet
		try {
			if (Meteor.user().profile.stripe.bank_account != null && Meteor.user().profile.stripe.bank_account != "" && Meteor.user().profile.stripe.bank_account != undefined) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
});

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
	$("title").text("My Account | Change Up");

});

Template.Account.onRendered(function () {
});

Template.Account.onDestroyed(function () {
	$("title").text("Change Up");

});
