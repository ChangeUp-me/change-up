/*****************************************************************************/
/* Navbar: Event Handlers */
/*****************************************************************************/
Template.Navbar.events({
});

/*****************************************************************************/
/* Navbar: Helpers */
/*****************************************************************************/
Template.Navbar.helpers({
});

/*****************************************************************************/
/* Navbar: Lifecycle Hooks */
/*****************************************************************************/
Template.Navbar.onCreated(function () {
});

Template.Navbar.onRendered(function () {
	$(function() {
		$('.toggle-nav').click(function() {
			// Calling a function in case you want to expand upon this.
			toggleNav();
		});
	});

	function toggleNav() {
		if ($('#site-wrapper').hasClass('show-nav')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-nav');
		} else {
			// Do things on Nav Open
			$('#site-wrapper').addClass('show-nav');
		}
		//$('#site-wrapper').toggleClass('show-nav');
	}
});

Template.Navbar.onDestroyed(function () {
});
