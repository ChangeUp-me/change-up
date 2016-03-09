Meteor.startup(function () {
  process.env.MAIL_URL = "smtp://postmaster@checkmatecreations.com:953fa072a4fe6187d6886920f268c8ad@smtp.mailgun.org:587"

  ContactUs.before.insert(function(userId, message) {
    Email.send({
      from: (message.name),
      to: ["geoff.bruskin@changeup.me", "matt.melillo@changeup.me"],
      replyTo: (message.email),
      subject: "Contact Us Submission",
      text: (message.message)
    });
  });
});
