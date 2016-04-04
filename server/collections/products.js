Meteor.methods({
	insertProduct : function insert_products (productObj) {
		var user = Meteor.user();

		if(!Roles.userHasRole(Meteor.userId(), 'vendor')) {
			throw new Meteor.Error('not-a-vendor', 'you do not have vendor access')
		}

		if(!user.profile.vendorId) {
			throw new Meteor.Error('no-vendor-id', 'you have vendor access but no vendor account, please create one');
		}

		productObj.price = parseFloat(productObj.price).toFixed(2);

		productObj.vendorId = user.profile.vendorId;

		Products.insert(productObj);
	},
	deleteProduct : function delete_products (productId) {
		Products.update({_id : productId, vendorId : Meteor.user().profile.vendorId}, {$set : {deleted : true}});
	},
	updateProduct : function update_products (productId, productObj) {
		delete productObj._id;

		Products.update({_id : productId}, {$set : productObj});
	},
	addProductReview : function add_product_review (productId, reviewObj) {
		var user = this.userId;
		reviewObj['userId'] = user;

		if (!user){
			return "please log in to post a review";
		} else if (Products.findOne({_id : productId },{'reviews.$.userId': user }) !== 0) {
			Products.update({ _id: productId, "reviews.userId": user }, { $set: { 'reviews.$': reviewObj } });
			return "review updated";
		} else {
			Products.update({_id : productId}, {$push : {reviews : reviewObj}});
			return true;
		}

		Meteor.users.update({_id: user}, {$addToSet: {'profile.reviews':productId}});

		// reviewObj.userId = user._id;
		// reviewObj.name = user.profile.name;
		//
		// if(!reviewObj.userId)
		// 	throw new Meteor.Error('not-logged-in', "please log in to post a review");
		//
		// Products.update({_id : productId}, {$push : {reviews : reviewObj}});
	}
});

Meteor.publish('products', function publish_products () {
	return Products.find({deleted : {$not : {$eq : true}}});
});
