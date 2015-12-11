/*****************************************************************************/
/* Cart: Event Handlers */
/*****************************************************************************/
Template.Cart.events({
});

/*****************************************************************************/
/* Cart: Helpers */
/*****************************************************************************/
Template.Cart.helpers({
	cartItems : function () {
		return [{
			productId : 'someid',
			size : 'L',
			color : 'Gray',
			quantity : 1,
			price : 42.00, //from seperate query
			image : { //added from seperate query
				src : 'cart_image.png'
			},
			productName : 'CMYK Shrt', //added from seperate query
			vendorName : 'Locally Roasted' //from seperate query
		}]
	},
	totals : function () {
		var products = [{
			price : 24.00
		}, {
			price : 28.00
		}];

		var total = 0;
		var shippingTotal = 6.00;

		_.each(products, function (val, indx) {
			total = val.price + total;
		})

		return {
			subTotal : total,
			shipping : shippingTotal,
			total : total + shippingTotal
		};
	}
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
