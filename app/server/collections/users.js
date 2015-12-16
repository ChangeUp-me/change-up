Meteor.methods({
	insertUser : function insert_user (userObj) {
		if(!_.isObject(userObj)){
			throw new Meteor.Error("not-an-object", 'the user must be an Object');
		}

		userObj.roles = ['user'];

		var id = Accounts.createUser(userObj);

		Roles.addUsersToRoles(id, ['user']);
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
		Roles.addUsersToRoles(this.userId, role);
	}
});

Meteor.publish('users', function publish_users (id) {
	return Meteor.users.find(this.userId);
});