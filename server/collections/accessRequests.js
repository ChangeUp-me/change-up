Meteor.publish('accessRequests', function publish_access_requests () {
	if(Roles.userHasRole(this.userId, 'admin')) {
		return accessRequests.find();
	} else {
		return accessRequests.find({userId : this.userId});
	}
});