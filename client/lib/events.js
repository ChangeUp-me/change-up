Template.MasterLayout.events({
	/**
	* register a user through email
	*/
	'submit [data-submit-emailregister]' : function email_register (event) {
		event.preventDefault();

		var form = event.target;
		var password = form.password.value;
		var email = form.email.value;
		var name = form.name.value;

		Meteor.call('insertUser',{
			email : email,
			password : password,
			profile : {
				name : name,
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

				$('#signupmodal').modal('hide');
				sAlert.success("you've been signed up!");

				Meteor.setTimeout(function () {
					var redirectedFrom = Session.get('redirectedFrom');

					if(redirectedFrom) {
						Session.set('redirectedFrom', undefined);
						return Router.go(redirectedFrom);
					}

					Router.go('shop');
				}, 500)
			})
		});
	},
	/**
	* register a user through facebook
	*/
	'click [data-click-facebookregister]' : function facebook_register (event) {
		event.preventDefault();

		Meteor.loginWithFacebook({
			requestPermissions : ['public_profile', 'email'],
			loginStyle : 'popup'
		}, function(err){
      if (err) {
      	console.error(err);
       return sAlert.error(err);
      }

      $('#signupmodal').modal('hide');
			sAlert.success("you've been signed up!");

      Meteor.setTimeout(function () {
					var redirectedFrom = Session.get('redirectedFrom');

					if(redirectedFrom) {
						Session.set('redirectedFrom', undefined);
						return Router.go(redirectedFrom);
					}

					Router.go('shop');
				}, 500)
    });
	},
	'click .like-button' : function toggle_like (event) {
			var likeBtn = event.target;

			if(!Meteor.userId()) {
				Session.set('autoLike', {id : this._id, vendor : this.vendorId});
				return $('#signupToLike').modal('show');
			}

			if(this.userLiked) {
				//remove the like
				Meteor.call('deleteLike', this._id, function (err) {
					if(err) {
						console.error(err);
						return sAlert.error(err);
					}
				})
			} else {
				Meteor.call('addLike', this._id, this.vendorId, function (err, result){
					if(err){
						console.error(err);
					}
				})
			}
		},

		/**
		* Add to cart button
		*/
		// 'submit form.product-item' : function (event) {
		// 	event.preventDefault();
		//
		// 	var form = event.target;
		// 	var cartItem = {
		// 		productId : form.productId.value,
		// 		size : form.size.value,
		// 		quantity : parseInt(form.quantity.value) || 1,
		// 		image : this.image
		// 	};
		//
		// 	CART.addItem(cartItem);
		// },
});
