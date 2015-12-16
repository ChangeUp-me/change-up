Products = new Mongo.Collection('products');

Meteor.methods({
	insertProduct : function insert_products (productObj) {
		Products.insert(productObj);
	},
	deleteProduct : function delete_products (productId) {
		Products.update({_id : productId}, {$set : {deleted : true}});
	},
	updateProduct : function update_products (productId, productObj) {
		Products.update({_id : productId}, {$set : productObj});
	}
});

Meteor.publish('products', function publish_products (id) {
	if(id) {
		return Products.findOne({
			_id : productId, 
			deleted : {$not : {$eq : false}}
		})
	} else {
		return Products.find({deleted : {$not : {$eq : false}}});
	}
});