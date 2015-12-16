Vendors = new Mongo.Collection('vendors');

//@todo - check that the user is an admin
Meteor.methods({
	/**
	* @todo - we'll have to change this up a bit
	* when we add  the admin, because they will
	* have the option of inserting a user id
	*
	*/
	insertVendor : function insert_vendor (obj) {
		if(!_.isObject(obj)){
			throw new Meteor.Error("not-an-object", 'the user must be an Object');
		}

		if(!Roles.userInRole(Meteor.userId()), ['vendor']) {
			throw new Meteor.Error('not-a-vendor', 'this user is not authorized to be a vendor')
		}

		obj.userId = Meteor.userId();

		Vendors.insert(obj)
	},
	deleteVendor : function delete_vendor (id) {
		Vendors.remove({_id : id});
	},
	updateVendor : function update_vendor (id, vendorObj) {
		Vendors.update({_id : id}, {$set : vendorObj});
	}
});

Meteor.publish('vendors', function publish_vendors (id) {
	if(id) {
		return Vendors.findOne({_id : id});
	} else {
		return Vendors.find();
	}
});