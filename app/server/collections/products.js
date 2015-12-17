Products = new Mongo.Collection('products');

Meteor.methods({
	insertProduct : function insert_products (productObj) {
		var user = Meteor.user();

		if(!Roles.userIsInRole(Meteor.userId(), 'vendor')) {
			throw new Meteor.Error('not-a-vendor', 'you do not have vendor access')
		}

		if(!user.profile.vendorId) {
			throw new Meteor.Error('no-vendor-id', 'you have vendor access but no vendor account, please create one');
		}

		productObj.vendorId = user.profile.vendorId;

		Products.insert(productObj);
	},
	deleteProduct : function delete_products (productId) {
		Products.update({_id : productId}, {$set : {deleted : true}});
	},
	updateProduct : function update_products (productId, productObj) {
		Products.update({_id : productId}, {$set : productObj});
	}
});

Meteor.publish('products', function publish_products () {
	return Products.find({deleted : {$not : {$eq : true}}});
});