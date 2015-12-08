Vendors = new Mongo.Collection('vendors');

//@todo - check that the user is an admin
Meteor.methods({
	insertVendor : function insert_vendor (obj) {
		Vendors.insert(obj)
	},
	deleteVendor : function delete_vendor (id) {
		Vendors.remove({_id : id});
	},
	updateVendor : function update_vendor (id, vendorObj) {
		Vendors.update({_id : id}, {$set : vendorObj});
	},
	showVendor : function show_vendor (id) {
		Vendors.findOne({_id : id});
	},
	listVendors : function list_vendors () {
		Vendors.find();
	}
});