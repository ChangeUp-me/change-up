/*****************************************************************************/
/* Checkout: Event Handlers */
/*****************************************************************************/
Template.Checkout.events({
	'click .charity' : function (event) {
		var charity = {
			name : this.name,
			category : this.category,
			id : this._id
		};

		Session.set('checkout:charity', charity);

		Router.go('/shipping')
	}
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
			email : form.email.value,
			//password : form.password.value,

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

		if(!billing.email) {
			return sAlert.error('please enter a valid email');
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
	'click #checkout' : function (event) {
		event.preventDefault();

		var billing = Session.get('checkout:billing');
		var shipping = Session.get('checkout:shipping');
		var charity = Session.get('checkout:charity');
		var user = Meteor.user();
		var cart = user.profile.cart;
		var exp = billing.cardExp.split('/');
		var email = billing.email;
		var button = $('button#checkout');

		if(!charity)
			return sAlert.error('please select a charity');

		//disable button
		button.prop('disabled', true);

		Stripe.card.createToken({
		    number: billing.creditCardNumber,
		    cvc: billing.cardCvv,
		    exp_month: exp[0],
		    exp_year: exp[1],
		}, function(status, response) {
		    var stripeToken = response.id;

		    if(response.error) {
		    	button.prop('disabled', false);
		    	return sAlert.error(response.error.message);
		    }

		    //delete sensitive card data
		    delete billing.creditCardNumber;
		    delete billing.cardExp;
		    delete billing.cardCvv;

		    //add card info
		    billing.lastFour = response.card.last4;
		    billing.cardBrand = response.card.brand;


		    Meteor.call('checkout',cart, charity, billing, shipping, stripeToken, email, function (err, transactionId) {
		    	button.prop('disabled', false);
		    	if(err){
		    		console.log(err);
		    		return sAlert.error(err);
		    	}

		    	if(!transactionId) {
		    		sAlert.error('something went wrong, please try again later');
		    		return console.error('no transaction id');
		    	} 

		    	console.log(transactionId);

		    	if(billing.save && user) {
		    		addShippingAndbilling();
		    	} else if(!billing.save && user) {
		    		emptyUsersCart();
		    	} else if (!user) {
		    		//create a new user?

		    	}
		    	
		    	Router.go('/confirmation/' + transactionId);
		    });
		});

		function addShippingAndbilling () {
			Meteor.call('updateUser',{
		    "profile.shipping" : shipping,
		    "profile.billing" : billing,
		    "profile.cart" : []
		   });

			//Router.go('confirmation');
		}

		function emptyUsersCart () {
			Meteor.call('updateUser', {
		    "profile.cart" : []
		   });

			//Router.go('confirmation');
		}

		function createNewUser (callback) {
			var u = {
		    email : billing.email,
				password : billing.password,
				profile : {
					name : form.name.value,
					dateRegistered : Date.now()
				}
		  };

		  if(billing.save) {
		    u.profile.shipping = shipping;
		   	u.profile.billing = billing;
		  }

		  Meteor.call('insertUser', u, callback);
		}
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
	},
	charity : function () {
		return Session.get('checkout:charity');
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
