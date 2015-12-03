/*****************************************************************************/
/* Cart: Event Handlers */
/*****************************************************************************/
Template.Cart.events({
});

/*****************************************************************************/
/* Cart: Helpers */
/*****************************************************************************/
Template.Cart.helpers({
});

/*****************************************************************************/
/* Cart: Lifecycle Hooks */
/*****************************************************************************/
Template.Cart.onCreated(function () {
});

Template.Cart.onRendered(function () {
	$(function() {
		$('.toggle-cart').click(function() {
			// Calling a function in case you want to expand upon this.
			toggleCart();
		});
	});

	function toggleCart() {
		if ($('#site-wrapper').hasClass('show-cart')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-cart');
		} else {
			// Do things on Nav Open
			$('#site-wrapper').addClass('show-cart');
		}
		//$('#site-wrapper').toggleClass('show-nav');
	}
});

Template.Cart.onDestroyed(function () {
});
