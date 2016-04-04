Template.VendorProducts.events({
	'click [data-delete-product]' : function (e) {
		//set the product item to delete later
		Session.set('productToDelete', this._id);
	},
	'click [data-reject-delete]' : function (e) {}
});

Template.MasterLayout.events({
	'click [data-confirm-delete]' : function (e) {
		var id = Session.get('productToDelete');

		Meteor.call('deleteProduct', id, function (err) {
			if(err) {
				console.error(err);
				sAlert.error('product could not be removed');
			}

			$('#myModal').modal('hide');
			Session.set('productToDelete', undefined);
		});
	}
})

Template.VendorProducts.helpers({
	products : function () {
		var user = Meteor.user();
		var products = Products.find({vendorId : user.profile.vendorId}).fetch();
		var vendorIds = [];


		if(products) {
			vendorIds = _.pluck(products, 'vendorId');

			var vendors = Vendors.find({_id : {$in : vendorIds}}).fetch();
			var indx;

			if(vendors)  {
				var p = products.map(function (product) {
					indx = vendors.findIndex(function (vendor) {
						return vendor._id == product.vendorId;
					})

					product.vendorName = vendors[indx].storeName;
					return product;
				});

				products = p;
			}	
		}
		
		return products;
	}
});

Template.VendorProducts.onRendered(function () {
	$('#myModal').on('hide.bs.modal', function (e) {
		console.log('hidden');
		Session.set('productToDelete', undefined);
	});
});

Template.VendorProducts.onDestroyed(function () {
	Session.set('productToDelete', undefined);
});