ContactMessages = new Mongo.Collection('contactmessages');

Meteor.methods({
	insertContactMessages : function insert_contact_message (contactObj) {
		//var currentUserId = Meteor.userId();
		ContactMessages.insert(contactObj);
	},
	deleteContactMessages : function delete_contact_messages (ContactMessagesId) {
		Charites.remove({_id : ContactMessagesId});
	},
	showContactMessages : function show_contact_messages (id) {
		ContactMessages.findOne({_id : id});
	},
	listContactMessages : function index_charity () {
		ContactMessages.find().fetch();
	}
});