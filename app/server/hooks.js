(function () {
	//send a newly created vendor an email
	Vendors.after.insert(function send_vendor_email(userId, doc) {
	  var user = Meteor.users.findOne(doc.userId);

	  if(!user)
	    return console.error("a vendor was created for a user that doesn't exist");

	  try{
	  	var email = user.emails[0].address;
	  	Email.send({
				to : email,
				from : 'terrell.changeup@gmail.com',
				subject : 'Your Vendor Account Is Ready!',
				text : 'A new vendor account was created for you.  Sign in to changeup.com to access it.'
			});
	  } catch (e) {
	  	console.error('could not send vendor email', e.stack);
	  }
	});
})();