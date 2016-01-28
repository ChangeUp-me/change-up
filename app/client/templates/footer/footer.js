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
