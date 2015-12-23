Likes = new Mongo.Collection('likes');

Meteor.methods({
	addLike : function add_like (productId, vendorId) {
		var user = Meteor.userId();

		if(!user) {
			throw new Meteor.Error('not-logged-in', 'you are not logged in');
		}

		Likes.update({productId : productId, userId : Meteor.userId()}, {$set : {vendorId : vendorId}}, {upsert : true});
	},
	deleteLike : function delete_like (productId) {
		var user = Meteor.userId();

		if(!user) {
			throw new Meteor.Error('not-logged-in', 'you are not logged in');
		}

		Likes.remove({productId : productId, userId : user})
	}
})

Meteor.publish('allLikes', function () {
	return Likes.find();
});

/*
Meteor.publish('likes', function publish_likes (productId, userId, vendorId) {
	var selector = {
			productId : productId
		};

		//count the number of product likes
		//for a user
		if(userId)
			selector.userId = Meteor.userId();

		//count the number of product likes for
		// a vendor
		if(vendorId)
			selector.vendorId = vendorId;

		return Likes.find(selector);
});*/