Meteor.publish('shipments', function (id) {
	return Shipments.find({vendorId : id});
});