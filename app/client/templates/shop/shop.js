(function () {
	/*****************************************************************************/
	/* Shop: Event Handlers */
	/*****************************************************************************/
	Template.Shop.events({
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
		'submit form.product-item' : function (event) {
			event.preventDefault();
			var form = event.target;
			var cartItem = {
				productId : form.productId.value,
				size : form.size.value,
				quantity : parseInt(form.quantity.value) || '1'
			};

			if(!cartItem.size) {
				return sAlert.info('please select a size');
			}

			Meteor.call('addToCart', cartItem, function (err) {
				if(err) {
					console.error(err);
					return sAlert.error(err);
				}

				sAlert.success('your item was added to the cart!');
			})
		}
	});

	/*****************************************************************************/
	/* Shop: Helpers */
	/*****************************************************************************/
	Template.Shop.helpers({
		products : function () {
			var products = Products.find({},{limit : 10, sort : {featuredPosition : 1}}).fetch();
			var vendorIds = [];
			var productIds = [];

			if(products) {
				var result = getIds(products);
				
				vendorIds = result[0];
				productIds = result[1];


				//find which products the user has liked
				var likes = Likes.find({userId : Meteor.userId(), productId : {$in : productIds}}).fetch();

				//find the vendor that owns each product
				var vendors = Vendors.find({_id : {$in : vendorIds}}).fetch();

				//join the vendors name to the correct products
				products = joinVendorsWithProducts(products, vendors);

				if(likes) {
					products  = addLikestoProducts(products, likes);
				}
			}

			return products;
		}
	});

	/*****************************************************************************/
	/* Shop: Lifecycle Hooks */
	/*****************************************************************************/
	Template.Shop.onCreated(function () {
	});

	Template.Shop.onRendered(function () {
	});

	Template.Shop.onDestroyed(function () {
	});


	/**
	* pull the product and vendorids from
	* products array
	*
	* @param {Array} products - [{_id : 'productid'}]
	* @return {Array} array containing an array for both product and vendor ids
	* [['vendoridone', 'vendoridtwo'], ['productidone', 'productidtwo']]
	*/
	function getIds (products) {
		var vendorIds = [];
		var productIds = [];

		products.forEach(function (val, indx) {
			if(vendorIds.indexOf(val.vendorId) < 0) {
				vendorIds.push(val.vendorId);
			}
			//capture each product id
			productIds.push(val._id);
		})

		return [vendorIds, productIds];
	}

	/**
	* Join the vendorname to the correct products (based off ids)
	*
	* @param {Array} products - [{_id : 'productid'}]
	* @param {Array} vendors - [{_id : 'vendorid'}]
	* @return {Array} products [{_id : 'productid', storeName : 'vendorStoreName'}]
	*/
	function joinVendorsWithProducts (products, vendors) {
		var id;
		products.forEach(function (product, indx) {
			id = product.vendorId;
			for(var i = 0; i < vendors.length; i++) {
				if(id == vendors[i]._id) {
					product.storeName = vendors[i].storeName;
					break;
				}
			}
		})

		return products;
	}

	/**
	* add a userLiked property with a value of True(Boolean)
	* to every product that a user has liked
	*
	* @param {Array} products - [{_id : 'productid'}]
	* @param {Array} Likes - [{_id : 'alikeid', productId : 'the_product_id_the_user_liked'}]
	* @return {Array} products [{_id : 'productid', userLiked : true | false}]
	*/
	function addLikestoProducts (products, likes) {
		var findlike;
		products.forEach(function (product, indx) {
			findLike = function (like) {
				return like.productId == product._id;
			};

			product.userLiked = (likes.findIndex(findLike) > -1) ? true : false;
		});

		return products;
	}
})();

