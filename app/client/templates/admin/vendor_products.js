Template.VendorProducts.helpers({
	products : function () {
		var user = Meteor.user();

		if(user) {

		}
		
		return Products.find({vendorId : user.profile.vendorId}).fetch();
	}
});