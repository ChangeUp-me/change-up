CART = (function () {
	var cart = {};

	cart.addItem = function (item) {
		if(Meteor.userId()) {
			this._setItemToServer(item);
		} else {
			this._setItemToClient(item);
		}
	};

	cart.getItems = function () {
		var user = Meteor.user();
		var cart;

		if(Meteor.userId()) {
			try{
				var cart = user.profile.cart;
				this._setSession(cart);
			} catch (e) {

			}
		} else {
			cart = this._getCartCookie();
			this._setSession(cart);
		}
		return this._getSession();
	};

	cart.removeItem = function (id) {
		if(Meteor.userId()) {
			this._removeItemFromServer(id);
		} else {
			this._removeItemFromClient(id);
		}
	};

	cart.empty = function () {
		if(Meteor.userId()) {
			Meteor.call('updateUser', {
				"profile.cart" : []
			}, function (err){
				if(err)
				return console.error('cart-empty', err);
			});
		}

		this._deleteCookie();
		this._deleteSession();
	}

	cart.getTotals = function () {
		var cart = this.getItems();
		var total = 0;
		var shippingTotal = 0;
		var shippingTotalArray = [];
		var duplicates = {};
		var cleanedArray = [];


		for (var i = 0; i < cart.length; i++) {
			var shippingInfo = {'vendorId': cart[i].vendorId, "vendorShipping": Vendors.findOne({_id: cart[i].vendorId}).shippingPrice}

			shippingTotalArray.push(shippingInfo)
		}

		for (var i = 0; i < shippingTotalArray.length; i++) {
			if (!duplicates[shippingTotalArray[i].vendorId]) {
				duplicates[shippingTotalArray[i].vendorId] = true;
				cleanedArray.push(shippingTotalArray[i]);
			}
		}

		for (var i = 0; i < cleanedArray.length; i++) {
			shippingTotal += parseFloat(cleanedArray[i].vendorShipping) || 0;
		}

		_.each(cart, function (val, indx) {
			total = (val.price * Math.max(1,val.quantity)) + total;
		})

		if(total == 0) shippingTotal = 0;

		return {
			//Rounds up to the nearest penny
			subTotal : Math.ceil(total * 100)/100,
			shipping : Math.ceil(shippingTotal * 100)/100,
			total : Math.ceil((total + shippingTotal) * 100)/100
		};
	};

	cart.signedIn = function () {
		if(Meteor.userId()) {
			cart = this._getCartCookie();
			for (var i = 0; i<cart.length; i++) {
				delete cart[i]['id'];
				delete cart[i]['vendorId'];
				delete cart[i]['shippingPrice'];
				delete cart[i]['price'];
				delete cart[i]['name'];
				this._setItemToServer(cart[i]);
			}
			this._deleteCookie();
			this._deleteSession();
		}
	};

	cart._getCartCookie = function () {
		return Cookie.get('cart', function (c) {
			try{
				c = JSON.parse(c);
			} catch (e) {
				c = {items : []};
			}

			if(!_.isArray(c.items))
			c = {items : []};

			return c.items;
		});
	}

	cart._setCartCookie = function (cart) {
		if(_.isArray(cart)) {
			cart = {items : cart};
		}

		Cookie.set('cart', JSON.stringify(cart));
	};

	cart._deleteCookie = function () {
		Cookie.remove('cart');
	}

	cart._getSession = function () {
		return Session.get('cart');
	}

	cart._setSession = function (cart) {
		cart = this._productItemJoin(cart);
		Session.set('cart', cart)
	};

	cart._deleteSession = function () {
		Session.set('cart', undefined);
	};


	cart._removeItemFromClient = function (id) {
		var cart = this._getSession();

		//find the index of the item to be removed
		var indx = cart.findIndex(function(item) {
			return item.id == id;
		})

		//remove it from the cart array
		cart.splice(indx, 1);

		this._setCartCookie(cart);
		this._setSession(cart);
	}

	cart._removeItemFromServer = function (id) {
		Meteor.call('removeFromCart', id, function (err, result) {
			if(err){
				console.log(err);
				return sAlert.error(err);
			}

			sAlert.success(this.name + ' was removed from your cart');
		})
	}

	cart._setItemToServer = function (cartItem) {
		Meteor.call('addToCart', cartItem, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error(err);
			}

			sAlert.success('your item was added to the cart!');
		});
	};

	cart._setItemToClient = function (cartItem) {
		//generate an id for the cart item
		cartItem.id = Random.id();

		//get the cart from the users cookie
		var cart = this._getCartCookie();

		//check if the item is already in the cart
		var indx = cart.findIndex(function(item) {
			return ((cartItem.productId == item.productId) && cartItem.size == item.size);
		})

		if (indx > -1) {
			//if it is just increment the quantity
			cart[indx].quantity = parseInt(cart[indx].quantity) + cartItem.quantity;
		} else {
			//add it to the cart
			cart.push(cartItem);
		}

		this._setSession(cart);
		this._setCartCookie(cart);

		sAlert.success('your item was added to the cart!');
	};

	cart._productItemJoin = function (cart) {
		var productIds = [];

		//get all the product ids
		cart.forEach(function (item, indx) {
			productIds.push(item.productId);
		})

		//fetch each product
		var products = Products.find({_id : {$in : productIds}}).fetch();

		//join product info to cart item
		cart = this._joinProductItemInfo(cart, products);

		return cart;
	};


	cart._joinProductItemInfo = function (cart, products) {
		var findIndx;
		var product;

		if(!products) return cart;

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
		})

		return cart;
	};

	return cart;
})();
