CHECKOUT = (function () {
	var checkout = {};
	
	checkout.createToken = function (card, callback) {
		var exp = card.cardExp.split('/');

		Stripe.card.createToken({
			number : card.creditCardNumber,
			cvc : card.cardCvv,
			exp_month : exp[0],
			exp_year : exp[1]
		}, callback);
	};

	checkout.validateCard = function (card) {
		var isValid = true;
		var exp = card.cardExp.split('/');

		//validate credit card
		if(!$.payment.validateCardNumber(card.creditCardNumber)) {
			sAlert.error('your credit card number is invalid');
			isValid = false;
		}

		if(!$.payment.validateCardExpiry(exp[0], exp[1])) {
			sAlert.error('your card expiration date is invalid')
			isValid = false;
		}

		if(!$.payment.validateCardCVC(card.cardCvv)) {
			sAlert.error('your card cvv is invalid');
			isValid = false;
		}

		return isValid;
	}

	checkout.saveUserInfo = function (shipping, billing) {
		Meteor.call('updateUser',{
		  "profile.shipping" : shipping,
		  "profile.billing" : billing,
		  "profile.cart" : []
		});
	};

	checkout.getCard = function (form) {
		return {
			creditCardNumber : form.creditCardNumber.value,
			creditCardName : form.creditCardName.value,
			cardExp : form.cardExp.value || '',
			cardCvv : form.cardCvv.value,
		}
	};

	checkout.getShipping = function (form) {
		return {
			fullName : form.fullName.value,
			addressOne : form.addressOne.value,
			addressTwo : form.addressTwo.value,
			city : form.city.value,
			zipcode : form.zipcode.value,
			state : form.state.value,
			country : form.country.value
		}
	};

	checkout.getBilling = function (form) {
		return {
			//biling
			fullName : form.fullName.value,
			addressOne: form.addressOne.value,
			addressTwo : form.addressTwo.value,
			city : form.city.value,
			zipcode : form.zipcode.value,
			state : form.state.value,
			country : form.country.value,
			//personal info
			email : form.email.value,
			creditCardName : form.creditCardName.value,
			//agreements
			save : form.save.checked,
			agree : form.agree.checked
		}
	};

	return checkout;
})();