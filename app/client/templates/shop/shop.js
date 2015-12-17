/*****************************************************************************/
/* Shop: Event Handlers */
/*****************************************************************************/
Template.Shop.events({
	'click .like-button' : function (event) {
		var productId = this._id;
		return;

		Meteor.call('insertLike', this._id, this.vendorId, function (err, result){
			if(err){
				console.error(err);
			}
		})
	},
	'click .add-to-cart-btn' : function (event) {

	}
});

/*****************************************************************************/
/* Shop: Helpers */
/*****************************************************************************/
Template.Shop.helpers({
	products : function () {
		var products = Products.find({},{limit : 10}).fetch();
		var vendorIds = [];

		//get every vendor id;
		products.forEach(function (val, indx) {
			if(vendorIds.indexOf(val.vendorId) < 0) {
				vendorIds.push(val.vendorId);
			}
		})

		//select vendors by vendor ids
		var vendors = Vendors.find({_id : {$in : vendorIds}}).fetch();

		//join the vendors name to the correct products
		var id;
		products.forEach(function (product, indx) {
			id = product.vendorId;
			for(var i = 0; i < vendors.length; i++) {
				if(id == vendors[i]._id) {
					product.storeName = vendors[i].storeName;
					break;
				}
			}
		})

		return products;
	}
});

/*****************************************************************************/
/* Shop: Lifecycle Hooks */
/*****************************************************************************/
Template.Shop.onCreated(function () {
});

Template.Shop.onRendered(function () {
});

Template.Shop.onDestroyed(function () {
});
