/*****************************************************************************/
/* Navbar: Event Handlers */
/*****************************************************************************/
Template.Navbar.events({
	/*'click #navbar a': function () {
		if ($('#site-wrapper').hasClass('show-nav')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-nav');
			$('#overlay').removeClass('show');
		}
	},*/
	'click #logout': function() {
		Meteor.logout(function(error) {
			if(!error) {
				window.location.replace('/');
			}
		});
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
	},
	isGuest :function () {
		return !Meteor.userId();
	},
	storeMade : function () {
		try {
			var storeName = Vendors.findOne({"_id":Meteor.user().profile.vendorId}).storeName;
			if (storeName !== null && storeName !== undefined && storeName !== "") {
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
/* Navbar: Lifecycle Hooks */
/*****************************************************************************/
Template.Navbar.onCreated(function () {
});

Template.Navbar.onRendered(function () {
	$(function() {
		$('.toggle-nav').click(function() {
			// Calling a function in case you want to expand upon this.
			$('#site-wrapper').toggleClass('show-nav');
			$('#overlay').toggleClass('show');
			$('#mobile-navbar,#navbar').toggleClass('nav-open');
		});
	});

	$(function() {
		$(window).resize(function() {
			if($(document).width() > 768 && $('#site-wrapper').hasClass('show-nav')) {
				$('#site-wrapper').removeClass('show-nav');
				$('#overlay').removeClass('show');
				$('#navbar, #mobile-navbar').removeClass('nav-open');
			}
		});
	});

	// Keeps off-canvas menus fixed at the top while allowing the canvas to scroll
	$(function() {
		$(window).resize(function() {
			if (!$('#site-wrapper').hasClass('show-nav')) {
				$('#navbar').css("top", 0);
			}
		});
	});
});

Template.Navbar.onDestroyed(function () {
});
