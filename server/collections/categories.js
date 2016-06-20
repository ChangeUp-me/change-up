Meteor.publish('categories', function publish_categories () {
	return Categories.find();
});
