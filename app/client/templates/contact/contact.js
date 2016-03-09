/*****************************************************************************/
/* Contact: Event Handlers */
/*****************************************************************************/
Template.Contact.events({
  'click #submit': function(e, template) {
    e.preventDefault()
    var name = template.find('#name').value;
    var email = template.find('#email').value;
    var message = template.find('#message').value;
    if (name === "" || email === "" || message === "") {
      $('#messageFeedback').text("Whoops! Make sure to fill in all fields so we know how to contact you!");
      $('#messageFeedbackContainer').addClass("alert, alert-danger");
    } else {
      var messageObj = {'name':name, 'email':email, "message":message};
      Meteor.call('saveMessage', messageObj, function(err) {
        if (!err) {
          $('#messageFeedback').text("Thank You! We have received your message and will get back to you shortly.");
          $('#messageFeedbackContainer').removeClass("alert, alert-danger");
          $('#messageFeedbackContainer').addClass("alert, alert-success");
        } else {
          $('#messageFeedback').text("Thank You! We have received your message and will get back to you shortly.");
          $('#messageFeedbackContainer').addClass("alert, alert-danger");
        }
      });
    }
  }
});

/*****************************************************************************/
/* Contact: Helpers */
/*****************************************************************************/
Template.Contact.helpers({
});

/*****************************************************************************/
/* Contact: Lifecycle Hooks */
/*****************************************************************************/
Template.Contact.onCreated(function () {
});

Template.Contact.onRendered(function () {
});

Template.Contact.onDestroyed(function () {
});
