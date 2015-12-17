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

		var userId = Meteor.userId();

		obj.userId = userId;

		delete obj._id;

		Vendors.update({userId : userId}, {$set : obj}, {upsert : true});

		//@todo - need to add a rollback incase this first query fails


		//link the new vendor to the user
		if(!Meteor.user().profile.vendorId) {
			var vendor = Vendors.findOne({userId : Meteor.userId()});

			Meteor.users.update(userId, {$set : {"profile.vendorId" : vendor._id}});
		}
	},
	deleteVendor : function delete_vendor (id) {
		Vendors.remove({_id : id});
	}
});

Meteor.publish('vendors', function publish_vendors () {
	return Vendors.find();
});