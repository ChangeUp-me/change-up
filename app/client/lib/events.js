Template.MasterLayout.events({
	/**
	* Like/unlike a product
	*/
	'click .like-button' : function toggle_like (event) {
			var likeBtn = event.target;

			if(!Meteor.userId()) {
				return sAlert.info('please login in order to like this product');
			}

			if(this.userLiked) {
				//remove the like
				Meteor.call('deleteLike', this._id, function (err) {
					if(err) {
						console.error(err);
						return sAlert.error(err);
					}
				})
			} else {
				Meteor.call('addLike', this._id, this.vendorId, function (err, result){
					if(err){
						console.error(err);
					}
				})
			}
		},

		/**
		* Add to cart button
		*/
		// 'submit form.product-item' : function (event) {
		// 	event.preventDefault();
		//
		// 	var form = event.target;
		// 	var cartItem = {
		// 		productId : form.productId.value,
		// 		size : form.size.value,
		// 		quantity : parseInt(form.quantity.value) || 1,
		// 		image : this.image
		// 	};
		//
		// 	CART.addItem(cartItem);
		// },
});
