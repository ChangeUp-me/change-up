Meteor.methods({
	insertUser : function insert_user (userObj) {
		Users.insert(userObj)
	},
	showUser : function show_user () {
		User.findOne(Meteor.userId()).fetch()
	},
	updateUser : function update_user (userObj) {
		User.update({_id : Meteor.userId()}, {$set : userObj});
	},	
	deleteUser : function delete_user () {
		User.remove({_id : Meteor.userId()})
	}
});