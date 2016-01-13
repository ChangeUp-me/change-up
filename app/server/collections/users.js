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

		var id = Accounts.createUser(userObj);

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
	}
});

Meteor.publish('users', function publish_users (id) {
	if(Roles.userHasRole(this.userId, 'admin')) {
		return Meteor.users.find();
	} else {
		return Meteor.users.find(this.userId);
	}
});