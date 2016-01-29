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
	"click .size-select li" : function (event) {
		$(event.target).toggleClass('selected');
	}
});

/*****************************************************************************/
/* Item: Helpers */
/*****************************************************************************/
Template.Item.helpers({
	charities : function () {
		return this.charities;
	},

	sizes : function () {
		var sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
		var selfSizes = this.sizes;

		//if the user has sizes set make them uppercase
		if(selfSizes) {
			selfSizes = selfSizes.map(function (size) {
			return size.toUpperCase();
		})
	}

	sizes = sizes.map(function (size) {
		if(selfSizes && selfSizes.indexOf(size) > -1)
			return {size : size, selected : true};
		else
			return {size : size, selected : false};
		})
		return sizes;
	}
});

/*****************************************************************************/
/* Item: Lifecycle Hooks */
/*****************************************************************************/
Template.Item.onCreated(function () {
});

Template.Item.onRendered(function () {
});

Template.Item.onDestroyed(function () {
});
