/*****************************************************************************/
/* Item: Event Handlers */
/*****************************************************************************/
Template.Item.events({
	'click .openShareWidget': function(){
		productId.set(this.product._id);
		productName.set(this.product.name);
		productDescription.set(this.product.description);
		$('#shareModal').modal('show');
	},
	"click .size-select li" : function (event, template) {
		var allSizes= [];
		for (var i = 0; i < template.data.product.sizes.length; i++) {
			allSizes.push("size"+template.data.product.sizes[i])
		}
		$('#' + allSizes.join(',#')).removeClass('selected');
		$('#' + allSizes.join(',#')).data('value', '');
		$(event.target).toggleClass('selected');
		$(event.target).data('value', 'selected');
	},
	'click .add-to-cart-btn': function(event, template){
		event.preventDefault();
		var selectedSize;

		var quantity = template.find('#quantity').value;
		var charity = template.find('#charities-select').value;
		for (var i = 0; i < this.product.sizes.length; i++) {
			if ($("#size"+this.product.sizes[i]).data('value') === "selected"){
				selectedSize = this.product.sizes[i];
			}
		}

		var cartItem = {
			productId : this.product._id,
			size : selectedSize,
			quantity : parseInt(quantity),
			image : this.product.image,
			charityId: charity
		};

		if (cartItem.quantity < 1) {
			sAlert.error('select a quantity more than 1');
		} else if(!cartItem.charityId) {
			sAlert.error('select a charity');
		} else if (isNaN(cartItem.quantity)) {
			sAlert.error('select a quantity');
		} else if (this.product.sizes.length !== 0 && cartItem.size === undefined && !template.data.product.oneSize) {
			sAlert.error('select a size');
		}  else {
			CART.addItem(cartItem);
		}
	}
});

/*****************************************************************************/
/* Item: Helpers */
/*****************************************************************************/
Template.Item.helpers({
	fixingVendorsSize : function () {
		if (this.product.sizes.length === 0) {
			return false;
		} else {
			return true;
		}
	},
	charities : function () {
		if (this.charities.length === 0) {
			var charities = Charities.find({},{limit:3}).fetch();
			return charities;
		} else {
			return this.charities;
		}
	},
	sizes: function(){
		return this.product.sizes;
	},
	productImages : function () {
		var images = [];

		if(this.image) {
			images.push(this.image);
		}

		if(this.images) {
			_.each(this.images, function (item) {
				images.push(item);
			})
		}

		return images;
	}

	// sizes : function () {
	// 	var sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
	// 	var selfSizes = this.sizes;
	//
	// 	//if the user has sizes set make them uppercase
	// 	if(selfSizes) {
	// 		selfSizes = selfSizes.map(function (size) {
	// 		return size.toUpperCase();
	// 	})
	// }
	//
	// sizes = sizes.map(function (size) {
	// 	if(selfSizes && selfSizes.indexOf(size) > -1)
	// 		return {size : size, selected : true};
	// 	else
	// 		return {size : size, selected : false};
	// 	})
	// 	return sizes;
	// }
});

/*****************************************************************************/
/* Item: Lifecycle Hooks */
/*****************************************************************************/
Template.Item.onCreated(function () {

});

Template.Item.onRendered(function () {
	$(".owl-carousel").owlCarousel({
		singleItem : true,
		items : 1,
	});
});

Template.Item.onDestroyed(function () {
});
