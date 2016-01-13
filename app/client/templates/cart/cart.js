/*****************************************************************************/
/* Cart: Event Handlers */
/*****************************************************************************/

Template.Cart.events({
	'click #cart a': function () {
		if ($('#site-wrapper').hasClass('show-cart')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-cart');
		} 
	},
	'click .delete' : function (event) {
		var id = this.id;

		if(!id) return sAlert.error('could not delete this item');

		CART.removeItem(id);
	}
});

/*****************************************************************************/
/* Cart: Helpers */
/*****************************************************************************/

Template.registerHelper('cartItems', function () {
	return CART.getItems();
})

Template.registerHelper('cartTotals', function () {
	return CART.getTotals();
})

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
