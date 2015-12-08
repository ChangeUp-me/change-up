ContactMessages = new Mongo.Collection('contactmessages');

Meteor.methods({
	insertContactMessage : function insert_contact_message (contactObj) {
		//var currentUserId = Meteor.userId();
		ContactMessages.insert(contactObj);
	},
	deleteContactMessage : function delete_contact_messages (ContactMessagesId) {
		Charites.remove({_id : ContactMessagesId});
	}
});

Meteor.publish('contacts', function publish_contacts (id) {
	if(id) {
		return ContactMessages.findOne({_id : id});
	} else {
		return ContactMessages.find();
	}
});