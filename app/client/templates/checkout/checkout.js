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

		Router.go('/shipping?charity='+encodeURIComponent(JSON.stringify(charity)));
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
			//personal info
			email : form.email.value,
			creditCardName : form.creditCardName.value,
			//agreements
			save : form.save.checked,
			agree : form.agree.checked
		};

		var button = $('#billingBtn');

		var card = {
			creditCardNumber : form.creditCardNumber.value,
			creditCardName : form.creditCardName.value,
			cardExp : form.cardExp.value || '',
			cardCvv : form.cardCvv.value,
		}

		var exp = card.cardExp.split('/');

		//check if the signed the agreement
		if(!billing.agree)
			return sAlert.info('please agree to the terms and conditions to continue');

		//check for an email
		if(!billing.email)
			return sAlert.error('please enter a valid email');

		//validate credit card
		if(!$.payment.validateCardNumber(card.creditCardNumber)) {
			return sAlert.error('your credit card number is invalid');
		} else if(!$.payment.validateCardExpiry(exp[0], exp[1])) {
			return sAlert.error('your card expiration date is invalid')
		} else if(!$.payment.validateCardCVC(card.cardCvv)) {
			return sAlert.error('your card cvv is invalid');
		}

		button.prop('disabled', true);

		sAlert.info('processing pleas wait...');

		Stripe.card.createToken({
			number : card.creditCardNumber,
			cvc : card.cardCvv,
			exp_month : exp[0],
			exp_year : exp[1]
		}, function (status, response) {
			if(response.error) {
			   button.prop('disabled', false);
			   console.error(response.error.message)
			   return sAlert.error("card validation failed");
			}

			//add card info
			billing.lastFour = response.card.last4;
		  billing.cardBrand = response.card.brand;
		  billing.stripeToken = response.id;
			
			Session.set('checkout:billing', billing);

			var shipping;
			try{
				shipping = JSON.stringify(Session.get('checkout:shipping'));
			} catch(e) {
				console.error('shipping-error', e);
			}

			if(!shipping)
				return sAlert.error('something was wrong with your shipping info');

			billing = encodeURIComponent(JSON.stringify(billing));
			shipping = encodeURIComponent(shipping);
			var charity = encodeURIComponent(JSON.stringify(Session.get('checkout:charity')));

			//Router.go('/summary', {}, {query : 'billing=' + billing +'&shipping=' + shipping});
			Router.go('/summary?' + 'billing=' + billing +'&shipping=' + shipping + '&charity=' + charity);
		});
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

		var shipping = encodeURIComponent(JSON.stringify(shippingInfo));
		var charity = encodeURIComponent(JSON.stringify(Session.get('checkout:charity')));

		Router.go('/billing?shipping='+ shipping + '&charity=' + charity);
	}
});

Template.Summary.events({
	'click #checkout' : function (event) {
		event.preventDefault();

		var billing = Session.get('checkout:billing');
		var shipping = Session.get('checkout:shipping');
		var charity = Session.get('checkout:charity');
		var user = Meteor.user();
		var cart = user.profile.cart; //@todo
		var email = billing.email;
		var button = $('button#checkout');
		var stripeToken = billing.stripeToken;

		delete billing.stripeToken;

		if(!charity)
			return sAlert.error('please select a charity');

		//disable button
		button.prop('disabled', true);

		sAlert.info('processing...');

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

		   if(billing.save && user) {
		      addShippingAndbilling();
		   } else if(!billing.save && user) {
		    	emptyUsersCart();
		   } else if (!user) {
		    //create a new user?
		   }
		    	
		   Router.go('/confirmation/' + transactionId);
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
