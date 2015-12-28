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

		if(!id) return;

		Meteor.call('removeFromCart', id, function (err, result) {
			if(err){
				console.log(err);
				return sAlert.error(err);
			}

			sAlert.success(this.name + ' was removed from your cart');
		})
	}
});

/*****************************************************************************/
/* Cart: Helpers */
/*****************************************************************************/

function joinProductItemInfo (cart, products) {
	var findIndx;
	var product;

	//join the product info to the cart items
	cart.forEach(function (item, indx) {
		findIndx = function (product) {
			return product._id == item.productId;
		};

		var indx = products.findIndex(findIndx);
		product = products[indx];

		if(!product) {
			return item = {};
		}

		item.vendorId = product.vendorId;
		item.shippingPrice = parseFloat(product.shippingPrice);
		item.price = parseFloat(product.price);
		item.name = product.name;
		item.image =  {
			src : 'cart_image.png'
		};
	})
	return cart;
}

Template.registerHelper('cartItems', function () {
	//@todo - make cart for non logged in users
	var user = Meteor.user();

	if(!user) return [];

	var cart = user.profile.cart || [];
	var productIds = [];

	//get all the product ids
	cart.forEach(function (item, indx) {
		productIds.push(item.productId);
	})

	//fetch each product
	var products = Products.find({_id : {$in : productIds}}).fetch();

	//join product info to cart item
	cart = joinProductItemInfo(cart, products);

	Session.set('cart', cart);
	return cart;
})

Template.registerHelper('cartTotals', function () {
	var cart = Session.get('cart') || [];
	var total = 0;
	var shippingTotal = 6.00;

	_.each(cart, function (val, indx) {
		total = (val.price * Math.max(1,val.quantity)) + total;
	})

	return {
		subTotal : total,
		shipping : shippingTotal,
		total : total + shippingTotal
	};
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
