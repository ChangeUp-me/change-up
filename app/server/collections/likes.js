Likes = new Mongo.Collection('likes');

Meteor.methods({
	insertLike : function insert_likes (likeObj) {
		likeObj = likeObj || {};

		likeObj.userId = Meteor.userId();
		Likes.insert(likeObj);
	},
	deleteLike : function delete_likes (productId) {
		Likes.remove({productId : productId, userId : Meteor.userId()})
	}
})

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
});