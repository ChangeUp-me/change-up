(function () {

	//add user role to new user
	//send them an email letting them know they signed up
	Accounts.onCreateUser(function (options, user) {
		var services = user.services;

		//if they login with facebook
		if(_.isObject(services) && _.isObject(services.facebook)) {
			var email = services.facebook.email || 'email@example.com';
			user.emails = [{address : email, verified : true}];
		}

		//add profile option and user name
		user.profile = user.profile || {};
		user.profile.name = user.profile.name || options.profile.name;

		return user;
	});

	Meteor.methods({
		insertUser : function insert_user (userObj) {
			if(!_.isObject(userObj)){
				throw new Meteor.Error("not-an-object", 'the user must be an Object');
			}

			//check if this user email already exists
			var exists = Accounts.findUserByEmail(userObj.email);

			if(exists) {
				throw new Meteor.Error("user-exists",'a user with this email already exists');
			}

			userObj.roles = ['user'];

			console.log('the userobj', userObj)

			var id = Accounts.createUser(userObj);

			if(id) {
				//send new user an email async
				Meteor.setTimeout(function () {
					Email.send({
						to : userObj.email,
						from : 'hello@changeup.me',
						subject : 'Welcome!',
						text : "You've created a new changeup account!  Go to http://changeup.me/login and login with your credentials."
					},10);
				})
			}

			Roles.setUserRoles(id, ['user']);
		},
		updateUser : function update_user (userObj) {
			Meteor.users.update({_id : this.userId}, {$set : userObj});
		},
		deleteUser : function delete_user () {
			Meteor.users.remove({_id : this.userId})
		},

		/**
		* update a users role
		*
		* role {String|Array} ['user','admin','vendor']
		*/
		addUserRole : function add_user_role (role) {
			Roles.setUserRoles(this.userId, role);
		},

		getMyReview : function (productId) {
			var user = Meteor.user();

			if(!user) return {};

			var productReview = Products.findOne({_id : productId },{'reviews.$.userId': user._id });

			if (productReview){
				productReview = productReview.reviews || [];
				for (var i = 0; i < productReview.length; i++) {
					if (productReview[i].userId === user._id) {
						productReview = productReview[i];
						break;
					}
				}
				return productReview;
			} else {
				return {};
			}
		}
	});

	Meteor.publish('users', function publish_users (id) {
		if(Roles.userHasRole(this.userId, 'admin')) {
			return Meteor.users.find();
		} else {
			return Meteor.users.find(this.userId);
		}
	});
})();
