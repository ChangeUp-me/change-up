/*****************************************************************************/
/* Navbar: Event Handlers */
/*****************************************************************************/
Template.Navbar.events({
	'click #navbar a': function () {
		if ($('#site-wrapper').hasClass('show-nav')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-nav');
		}
	}
});

/*****************************************************************************/
/* Navbar: Helpers */
/*****************************************************************************/
Template.Navbar.helpers({
	isVendor : function () {
		return Roles.userHasRole(Meteor.userId(), 'vendor');
	},
	isAdmin : function () {
		return Roles.userHasRole(Meteor.userId(), 'admin');
	},
	isLoggedIn : function () {
		return Meteor.userId();
	}
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

	$(function() {
		$(window).resize(function() {
			if($(document).width() > 768 && $('#site-wrapper').hasClass('show-nav')) {
				$('#site-wrapper').removeClass('show-nav');
			}
		});
	});
});

Template.Navbar.onDestroyed(function () {
});
