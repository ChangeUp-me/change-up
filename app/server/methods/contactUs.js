Meteor.methods({
  saveMessage : function (message) {
    ContactUs.insert(message);
  }
});
