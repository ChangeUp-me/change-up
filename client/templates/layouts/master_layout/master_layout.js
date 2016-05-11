Template.MasterLayout.helpers({
	user : function () {
		var user = Meteor.user();

		if(user) {
			user = {
				email : user.emails[0].address,
				name : user.profile.name
			}

			user.name = user.name || "";

			//only display if the first and last name
			//are given
			if(user.name.split(' ').length < 2) {
				delete user.name;
			}
		}

		return user || {};
	}
})

Template.MasterLayout.events({
	"click [data-click-openshippingmodal]" : function (event) {
    event.preventDefault();

    $('#create-shipping-account').modal('show');
  },
	"submit [data-submit-integrateeasypost]" : function (event) {
    event.preventDefault();

    var form = event.target;

    var apiKeys = {
      testApiKey : form.testApiKey.value,
      productionApiKey : form.productionApiKey.value
    };

    Meteor.call('integrateShippingApiKeys', apiKeys, function (err, result) {
      if(err) {
        return sAlert.error(err);
      }

      sAlert.success('Your EasyPost account was created!');

      $('#shipping-account-created').modal('hide');
    });
  },
	'submit [data-submit-integrateshippingapi]' : function (event) {
    event.preventDefault();

    var form = event.target;

    console.log('the form', form);

    var shippingAccount = {
      name : form.name.value,
      email : form.email.value,
      password : form.password.value,
      password_confirmation : form.password_confirmation.value,
      phone_number : form.phone_number.value
    }

    Meteor.call('createShippingAccount', shippingAccount, function (err, result) {
    	if(err) {
    		console.error(err);
    		return sAlert.error(err);
    	}

    	sAlert.success('easypost account was created')


    	$('#create-shipping-account').modal('hide');

			$('#shipping-account-created').modal('show');
    });
  },
	'submit [data-submit-changepassword]' : function (event) {
		event.preventDefault();
		
		var form = event.target;

		var oldPassword = form.oldPassword.value;
		var newPassword = form.newPassword.value;

		Accounts.changePassword(oldPassword, newPassword, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error(err);
			}

			sAlert.success('your password was changed!');
			$('#change-password').modal('hide');
		})
	},
	'submit [data-submit-signupToLike]' : function (event) {
		event.preventDefault();

		var form = event.target;
		var user = {email : form.email.value};
		var password = form.password.value;
		var confirmPassword = form.confirmPassword.value;
		var email = form.email.value;


		var likeThis = Session.get('autoLike') || {};

		if(!password) return sAlert.error('please enter a password');

		if(password !== confirmPassword) return sAlert.error("your passwords don't match");

		if(!email) return sAlert.error('please enter a valid email');

		Meteor.call('insertUser',{
			email : email,
			password : password,
			profile : {
				dateRegistered : Date.now()
			}
		}, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error("The Signup Failed");
			}
			Meteor.loginWithPassword(email, password, function (err) {
				if(err) {
					console.error(err);
					return sAlert.error('we could not log you in');
				}

				sAlert.success("you've been signed up!");

				$('#signupToLike').modal('hide');
				$('body').removeClass('modal-open');

				//automatically like product
				Meteor.call('addLike', likeThis.id, likeThis.vendor, function (err, result){
					if(err){
						console.error(err);
					}
				})
			})
		});
	},
	'submit [data-submit-emailsubscribe]' : function (event) {
		event.preventDefault();

		var form = event.target;
		var email = form.email.value;

		if(!email) {
			return sAlert.error('please enter your email');
		}

		sAlert.info("hold on we're attempting to sign you up");

		Meteor.call('email_subscribe',  email, function (err, result) {
			if(err) {
				console.error(err);
				return sAlert.error("we couldn't subscribe you");
			}

			console.log('teh result', result);

			sAlert.success("you're all signed up!")
			Cookie.set('subscriber', 'subscribed')

			$('#signupmodal').modal('hide');
		})
	},
	'click .toggle-cart' : function () {
		if ($('#site-wrapper').hasClass('show-cart')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-cart');
			$('#cart').removeClass('show-cart');
			$('#navbar, #mobile-navbar').removeClass('cart-open');
			$('#overlay').removeClass('show');
		} else {
			// Do things on Nav Open
			$('#cart').addClass('show-cart');
			$('#site-wrapper').addClass('show-cart');
			$('#overlay').addClass('show');
			$('#navbar, #mobile-navbar').addClass('cart-open');
		}
	},
	'click #overlay': function() {
		//closes all open menus
		//func is below
		closeOpenMenus();
	},
	'click .zoomable-image' : function (event) {
		var $image = $(event.target)
		var $clone = $image.clone();
		var $window = $(window);
		var imagePosition = $image.offset();
		var $wrap = $('<div id="zoom-wrap"></div>').html($clone).css('display','none');
		var $overlay = $('<div id="zoom-overlay"></div>');
		var $body = $('body');

		$body.append($wrap);
		$body.append($overlay);

		var t1 = new TimelineMax();
		var t2 = new TimelineMax();

		t2.to($overlay, .5, {
		  opacity : 1
		})

		$body.addClass('no-scroll');

		t1
		 .set($wrap, {
		 		display : 'flex',
				position : 'absolute',
				top : imagePosition.top,
				left : imagePosition.left,
				height : $image.outerHeight(),
				width :  $image.outerWidth(),
				"z-index" : 99999,
				opacity : .5
			})
		 .to($image,0,{
		 	opacity : 0
		 })
		 .to($wrap, .5, {
		 	padding : '30px',
		 	top : 0,
		 	left: 0,
		 	width : $window.width(),
		 	height: $window.height(),
		 	opacity : 1
		 })
		 .to($wrap, 0, {
		 		width : '100%',
		 		height : '100%'
		 })

		$wrap.one('click', function () {
			t2.reverse();
			t1.reverse();
			setTimeout(function () {
				$wrap.remove();
				$overlay.remove();
				$body.removeClass('no-scroll');
			},500);
		})
	},
});


Template.MasterLayout.onRendered(function () {

	/**
	* @description - whenever the route changes
	* close the menus (sidebars);
	*/
	Router.onBeforeAction(function () {
		//closes all open menus
		//func is below
	  closeOpenMenus();
	  this.next();
	});

	//show popup to a user X seconds after they first land on the site
	var subscribed = Cookie.get('subscriber');

	if(!Meteor.user() && !subscribed) {

		$('#popup_close').on('click', function () {
			$('#signupmodal').modal('hide');
		})

		Meteor.setTimeout(function () {
			$('#signupmodal').modal('show');
		},30000);
	}
})


function closeOpenMenus () {
	  $('#cart').removeClass('show-cart');
	  $('#site-wrapper').removeClass('show-nav');
	  $('#site-wrapper').removeClass('show-cart');
	  $('#navbar, #mobile-navbar').removeClass('cart-open');
	  $('#navbar, #mobile-navbar').removeClass('nav-open')
	  $('#overlay').removeClass('show');
	}