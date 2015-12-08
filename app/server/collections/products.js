Products = new Mongo.Collection('products');

Meteor.methods({
	insertProducts : function insert_products (productObj) {
		Products.insert(contactObj);
	},
	deleteProducts : function delete_products (productId) {
		Products.update({_id : productId}, {$set : {deleted : true}});
	},
	updateProducts : function update_products (productId, productObj) {
		Products.update({_id : productId}, {$set : productObj});
	},
	listProducts : function list_products (howMany) {
		howMany = howMany || 10;

		Products
		  .find({deleted : {$not : { $eq : false}}})
		  .limit(howMany)
		  .fetch();
	},
	showProducts : function show_products (productId) {
		Products.findOne({
			_id : productId, 
			deleted : {$not : {$eq : false}}
		}).fetch();
	}
});