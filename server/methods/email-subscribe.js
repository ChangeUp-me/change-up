(function () {
	Meteor.methods({
		email_subscribe : function (email) {
			var mailchimp = new MailChimp("59d589bd95de09e03eef8b665f52fa7c-us13");

			return mailchimp.call('lists', 'members', {
				id : "33d3360910",
				status : "subscribed",
				email_address : email,
			});
		}
	})
})();