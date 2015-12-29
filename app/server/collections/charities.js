Meteor.methods({
	insertCharity : function insert_charity (charityObj) {
		Charities.insert(charityObj);
	},
	deleteCharity : function delete_charity (charityId) {
		Charites.remove({_id : charityId});
	},
	updateCharity : function 	update_charity (charityId, charityObj) {
		Charities.update({_id : charityId}, {$set : charityObj})
	}
});

Meteor.publish('allCharities', function publish_charities (id) {
	if(id) {
		return Charities.findOne({_id : id});
	} else {
		return Charities.find();
	}
});