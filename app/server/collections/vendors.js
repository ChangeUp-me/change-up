Vendors = new Mongo.Collection('vendors');

//@todo - check that the user is an admin
Meteor.methods({

	/**
	* @todo - we'll have to change this up a bit
	* when we add  the admin, because they will
	* have the option of inserting a user id
	*
	*/
	updateVendor : function update_vendor (obj) {
		if(!_.isObject(obj)){
			throw new Meteor.Error("not-an-object", 'the user must be an Object');
		}

		if(!Roles.userIsInRole(Meteor.userId(), 'vendor')) {
			throw new Meteor.Error('not-a-vendor', 'this user is not authorized to be a vendor')
		}

		obj.userId = Meteor.userId();

		Vendors.update({userId : Meteor.userId()}, {$set : obj}, {upsert : true});
	},
	deleteVendor : function delete_vendor (id) {
		Vendors.remove({_id : id});
	}
});

Meteor.publish('vendors', function publish_vendors (id) {
	if(id) {
		return Vendors.find({userId : id});
	} else {
		return Vendors.find();
	}
});