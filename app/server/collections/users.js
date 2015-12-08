Meteor.methods({
	insertUser : function insert_user (userObj) {
		Users.insert(userObj)
	},
	updateUser : function update_user (userObj) {
		User.update({_id : Meteor.userId()}, {$set : userObj});
	},	
	deleteUser : function delete_user () {
		User.remove({_id : Meteor.userId()})
	}
});

Meteor.publish('users', function publish_users (id) {
	return User.findOne(Meteor.userId());
});