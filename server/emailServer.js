Meteor.startup(function () {
  ContactUs.before.insert(function(userId, message) {
    Email.send({
      from: (message.name),
      to: ["geoff@changeup.me", "matt@changeup.me"],
      replyTo: (message.email),
      subject: "Contact Us Submission",
      text: (message.message)
    });
  });
});
