
/*****************************************************************************/
/* Checkout: Event Handlers */
/*****************************************************************************/
Template.Checkout.events({
	'click .continueCart' : function () {
		Router.go('/shipping');
	},
	'click .delete' : function (event) {
		var id = this.id;

		if(!id) return sAlert.error('We could not delete this item at this time.');

		CART.removeItem(id);
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
		var button = $('#billingBtn');
		var billing = CHECKOUT.getBilling(form);
		var card = CHECKOUT.getCard(form);
		var password = form.password ? form.password.value : null;

		//check if a guest failed to enter a password
		if(!Meteor.userId() && (!password || password.length < 2))
			return sAlert.info('Whoops! That password doesnt work. Please try again.');

		//check for an email
		if(!billing.email)
			return sAlert.error('Whoops! That email doesnt work. Please try again.');

		//check if the signed the agreement
		if(!billing.agree)
			return sAlert.info('Please agree to the terms and conditions to continue.');

		//validate the credit card
		if(!CHECKOUT.validateCard(card)) return;

		button.prop('disabled', true);

		sAlert.info('Stay Put! We are processing your order!');

		//create a stripecard token
		CHECKOUT.createToken(card, function token_created (status, response) {
			button.prop('disabled', false);
			if(response.error) {
			   console.error(response.error.message)
			   return sAlert.error("card validation failed");
			}

			//add card info
			billing.lastFour = response.card.last4;
		  billing.cardBrand = response.card.brand;
		  billing.stripeToken = response.id;

		  //generate the url with the correct parameters
		  var goToUrl = function () {
		  	Session.set('checkout:billing', billing);

				var shipping;
				try{
					shipping = JSON.stringify(Session.get('checkout:shipping'));
				} catch(e) {
					console.error('shipping-error', e);
				}

				if(!shipping)
					return sAlert.error('Whoops! It looks like there is something not correct with your shipping info.');

				//url encode billing, shipping, and charity params
				billing = encodeURIComponent(JSON.stringify(billing));
				shipping = encodeURIComponent(shipping);

				//take us to the summary page
				Router.go('/summary?' + 'billing=' + billing +'&shipping=' + shipping);
		  };

			//if this is a new user sign them up
			// and log them in
			if(!Meteor.user()) {
				Meteor.call('insertUser',{
					email : billing.email,
					password : password,
					profile : {
						name : billing.fullName,
						dateRegistered : Date.now()
					}
				}, function (err) {
					if(err) {
						//if the user's email already exists
						if(err.error == 'user-exists') {
							//try to log the user in with the password they gave
							Meteor.loginWithPassword(billing.email, password, function (err) {
								if(err) {
									//if login fails send them an error
									return sAlert.error('Hmmm, this email already exists in our system. Please try with a different email.');
								}

								var cart = Session.get('cart');

								//set this cart to the current session
								Meteor.call('setCart', cart, function (err) {
									if(err) {
										console.error(err);
										return sAlert.error('Oh no! Something went wrong... please try again later.');
									}

									goToUrl();
								});
							})
						} else {
							//the email doesn't exist, but something went wrong
							//with trying to log this user in.
							console.error(err);
							return sAlert.error("Oh no! Something went wrong..please try again later");
						}
					} else {
						goToUrl();
					}
				});
			} else {
				goToUrl();
			}
		});
	}
});


Template.Shipping.events({
	'submit form#shipping' : function (event) {
		event.preventDefault();
		var form = event.target;

		if(!form.checkValidity()) {
			return sAlert.error('Whoops! You managed to miss some fields.');
		}

		var shippingInfo = CHECKOUT.getShipping(form);
		Session.set('checkout:shipping', shippingInfo);

		var shipping = encodeURIComponent(JSON.stringify(shippingInfo));

		Router.go('/billing?shipping='+ shipping);
	}
});

Template.Summary.events({
	'click #checkout' : function (event) {
		event.preventDefault();

		var billing = Session.get('checkout:billing');
		var shipping = Session.get('checkout:shipping');
		var user = Meteor.user();
		var cart = CART.getItems(); //@todo
		var email = billing.email;
		var button = $('button#checkout');
		var stripeToken = billing.stripeToken;

		delete billing.stripeToken;

		//disable button
		button.prop('disabled', true);

		sAlert.info('processing...');

		Meteor.call('checkout',cart, billing, shipping, stripeToken, email, function (err, transactionId) {
		  button.prop('disabled', false);
		  if(err){
		    console.log(err);
		    return sAlert.error(err);
		  }

		  if(!transactionId) {
		    sAlert.error('Whoops! Something went wrong, please try again later.');
		    return console.error('no transaction id');
		   }

		   if(billing.save && user) {
		      CHECKOUT.saveUserInfo(shipping, billing);
		   }

		   CART.empty();

		   Router.go('/confirmation/' + transactionId);
		});
	}
})

/*****************************************************************************/
/* Checkout: Helpers */
/*****************************************************************************/
Template.Checkout.helpers({
	itemsInCart : function () {
		return CART.getItems();
	},
	detailsOfItem : function(productId) {
		return Products.find({_id: productId }).fetch();
	},
	price : function (price, quantity) {
		return (price*quantity);
	},
	cartEmpty : function () {
		var cart = CART.getItems() || [];

		return CART.getItems().length > 0 ? false : true;
	}
});

Template.Billing.helpers({
	loggedIn : function () {
		return Meteor.userId() ? true : false;
	}
})

Template.Summary.helpers({
	checkout : function () {
		return {
			billing : Session.get('checkout:billing'),
			shipping : Session.get('checkout:shipping')
		}
	},
	billingLink : function () {
		return '/billing?shipping='+ encodeURIComponent(JSON.stringify(Session.get('checkout:shipping')));
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
