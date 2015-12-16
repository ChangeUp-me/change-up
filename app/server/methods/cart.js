Meteor.methods({
	addToCart : function add_to_cart (productObj) {
		Users.update({
			_id : Meteor.userId()
		}, {
			'profile.cart' : {$push : productObj}
		});
	}
})