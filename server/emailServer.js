Meteor.startup(function () {
  ContactUs.before.insert(function(userId, message) {
    Email.send({
      from: message.email,
      to: ["geoff@changeup.me", "matt@changeup.me", "niksurb228@gmail.com"],
      replyTo: message.email,
      subject: "Contact Us Submission",
      text: message.name + ' : ' + message.message
    });
  });
});
