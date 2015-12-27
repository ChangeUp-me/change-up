/*****************************************************************************/
/* Checkout: Event Handlers */
/*****************************************************************************/
Template.Checkout.events({
});

Template.Billing.events({
	'change #sameAs' : function (event) {
		var checkbox = event.target;

		if(checkbox.checked) {
			var shipping = Session.get('checkout:shipping');
			var billing = Session.get('checkout:billing') || {};

			var obj = _.extend(billing, shipping);

			Session.set('checkout:billing', obj);
		}
	},
	'submit form#billing' : function (event) {
		event.preventDefault();

		var form = event.target;

		var billing = {
			//biling
			fullName : form.fullName.value,
			addressOne: form.addressOne.value,
			addressTwo : form.addressTwo.value,
			city : form.city.value,
			zipcode : form.zipcode.value,
			state : form.state.value,
			country : form.country.value,

			//payment method
			creditCardNumber : form.creditCardNumber.value,
			creditCardName : form.creditCardName.value,
			cardExp : form.cardExp.value || '',
			cardCvv : form.cardCvv.value,

			//agreements
			save : form.save.checked,
			agree : form.agree.checked
		};

		if(!billing.agree) {
			return sAlert.info('please agree to the terms and conditions to continue');
		}

		var exp = billing.cardExp.split('/');

		//validate credit card
		if(!$.payment.validateCardNumber(billing.creditCardNumber)) {
			return sAlert.error('your credit card number is invalid');
		} else if(!$.payment.validateCardExpiry(exp[0], exp[1])) {
			return sAlert.error('your card expiration date is invalid')
		} else if(!$.payment.validateCardCVC(billing.cardCvv)) {
			return sAlert.error('your card cvv is invalid');
		}

		//create stripe token
		//delete cardnumber and cardcvv


		Session.set('checkout:billing', billing);

		Router.go('/summary');
	}
});


Template.Shipping.events({
	'submit form#shipping' : function (event) {
		event.preventDefault();
		var form = event.target;

		if(!form.checkValidity()) {
			return sAlert.error('woops looks like you missed some fields!');
		}

		var shippingInfo = {
			fullName : form.fullName.value,
			addressOne : form.addressOne.value,
			addressTwo : form.addressTwo.value,
			city : form.city.value,
			zipcode : form.zipcode.value,
			state : form.state.value,
			country : form.country.value
		}

		Session.set('checkout:shipping', shippingInfo);
		Router.go('/billing');
	}
});

Template.Summary.events({
	'submit form#checkout' : function (event) {
		event.preventDefault();

		var form = event.target

		var billing = Session.get('checkout:billing');
		var shipping = Session.get('checkout:shipping');
		var cart = Session.get('cart');
		var exp = billing.cardExp.split('/');
		var price = form.finalPrice.value; //@todo

		Stripe.card.createToken({
		    number: billing.creditCardNumber,
		    cvc: billing.cardCvv,
		    exp_month: exp[0],
		    exp_year: exp[1],
		}, function(status, response) {
		    var stripeToken = response.id;

		    delete billing.creditCardNumber;
		    delete billing.cardExp;
		    delete billing.cardCvv;

		    Meteor.call('checkout', price, cart, billing, shipping, stripeToken, function (err) {
		    	if(err){
		    		return sAlert.error(err);
		    	}

		    	//do something else
		    });
		});
	}
})

/*****************************************************************************/
/* Checkout: Helpers */
/*****************************************************************************/
Template.Checkout.helpers({
	charities : function () {
		return Charities.find().fetch();
	}
});

Template.Summary.helpers({
	checkout : function () {
		return {
			billing : Session.get('checkout:billing'),
			shipping : Session.get('checkout:shipping')
		}
	}
})

/*****************************************************************************/
/* Checkout: Lifecycle Hooks */
/*****************************************************************************/
Template.Checkout.onCreated(function () {
});

Template.Checkout.onRendered(function () {
});

Template.Checkout.onDestroyed(function () {
});
