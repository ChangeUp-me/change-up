/*****************************************************************************/
/* Footer: Event Handlers */
/*****************************************************************************/
Template.Footer.events({
	'click #to-top': function() {
		$('html, body').animate({scrollTop : 0},800);
		return false;
	}
});

/*****************************************************************************/
/* Footer: Helpers */
/*****************************************************************************/
Template.Footer.helpers({
	isVendor : function() {
		try {
			var roles = Meteor.user().roles;
			var found = $.inArray("vendor", roles);
			if (found !== (-1)) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
});

/*****************************************************************************/
/* Footer: Lifecycle Hooks */
/*****************************************************************************/
Template.Footer.onCreated(function () {
});

Template.Footer.onRendered(function () {
});

Template.Footer.onDestroyed(function () {
});
