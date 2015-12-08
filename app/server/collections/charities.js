Charities = new Mongo.Collection('charities');

Meteor.methods({
	insertCharity : function insert_charity (charityObj) {
		//var currentUserId = Meteor.userId();
		Charities.insert(charityObj);
	},
	deleteCharity : function delete_charity (charityId) {
		Charites.remove({_id : charityId});
	},
	updateCharity : function 	update_charity (charityId, charityObj) {
		Charities.update({_id : charityId}, {$set : charityObj})
	},
	showCharity : function show_charity (charityId) {
		Charities.findOne({_id : charityId}).fetch();
	},
	listCharity : function index_charity () {
		Charities.find().fetch();
	}
});