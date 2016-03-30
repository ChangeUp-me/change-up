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