Meteor.methods({
	addToCart : function add_to_cart (cartItem) {
		Meteor.users.update({
			_id : Meteor.userId()
		}, {
			$push :  {'profile.cart' : cartItem}
		});
	},
	removeFromCart : function remove_from_cart (id) {
		console.log('the id', Meteor.userId());

		//weird error where mongodb $pull won't work
		//in meteor but will in console
		//$pull : {'profile.cart': {id :id}}
		var user = Meteor.user();

		if(!user) {
			throw new Meteor.Error('not-logged-in', 'the user is not logged in');
		}

		var cart = user.profile.cart;

		var indx = cart.findIndex(function (item) {
			return item.id == id;
		})

		cart.splice(indx, 1);

		Meteor.users.update(Meteor.userId(), {$set : {'profile.cart' : cart}});
	}
})