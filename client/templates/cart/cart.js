/*****************************************************************************/
/* Cart: Event Handlers */
/*****************************************************************************/

Template.Cart.events({
	'click #cart a': function () {
		if ($('#site-wrapper').hasClass('show-cart')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-cart');
			$('#overlay').removeClass('show');
		}
	},
	'click .delete' : function (event) {
		var id = this.id;

		if(!id) return sAlert.error('We could not delete this item at this time.');

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
	// Keeps off-canvas menus fixed at the top while allowing the canvas to scroll
	$(function() {
		$(window).scroll(function() {
			var scrollPosition = $(window).scrollTop();
			//$('#cart').css("top", 0 + (scrollPosition));
		});
	});
});

Template.Cart.onDestroyed(function () {
});
