Likes = new Mongo.Collection('likes');

Meteor.methods({
	insertLikes : function insert_likes (likeObj) {
		likeObj = likeObj || {};

		likeObj.userId = Meteor.userId();
		Likes.insert(likeObj);
	},
	countLikes : function count_likes (productId, userId, vendorId) {
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

		Likes.find(selector).count();
	},
	deleteLikes : function delete_likes (productId) {
		Likes.remove({productId : productId, userId : Meteor.userId()})
	}
})