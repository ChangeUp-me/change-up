(function () {
	/*****************************************************************************/
	/* Shop: Event Handlers */
	/*****************************************************************************/
	Template.Shop.events({
		'click .openShareWidget': function(){
			productId.set(this._id);
			productName.set(this.name);
			productDescription.set(this.description);
			$('#shareModal').modal('show');
		},


		'click .add-to-cart-btn': function(event, template){
			event.preventDefault();
			var selectedSize;
			var quantity = template.find('#quantity'+this._id).value;
			var charity = template.find('#charities'+this._id).value;
			for (var i = 0; i < this.sizes.length; i++) {
				if ($("#"+this._id+""+this.sizes[i]).data('value') === "selected"){
					selectedSize = this.sizes[i];
				}
			}
			var cartItem = {
				productId : this._id,
				size : selectedSize,
				quantity : parseInt(quantity),
				image : this.image,
				charityId: charity
			};

			if (cartItem.quantity < 1) {
				sAlert.error('select a quantity more than 1');
			} else if(!cartItem.charityId){
				sAlert.error('select a charity');
			} else if (isNaN(cartItem.quantity)) {
				sAlert.error('select a quantity');
			} else if (this.sizes.length !== 0 && cartItem.size === undefined && !this.oneSize) {
				sAlert.error('select a size');
			} else  {
				CART.addItem(cartItem);
			}
		}


	});

	/*****************************************************************************/
	/* Shop: Helpers */
	/*****************************************************************************/
	Template.Shop.helpers({
		tweet_ids : function () {
			return Session.get('news_tweets')
		},
		products : function () {
			try {
				var fpIDs = FeaturedProducts.findOne().products;
				var products = Products.find({_id:{$in:fpIDs}}).fetch();
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
			} catch (e) {

			}
		}
	});

	/*****************************************************************************/
	/* Shop: Lifecycle Hooks */
	/*****************************************************************************/
	Template.Shop.onCreated(function () {
		$("title").text("Home | Change Up");

	});

	Template.Shop.onRendered(function () {
		get_tweets();
	});

	Template.Shop.onDestroyed(function () {
		$("title").text("Change Up");

	});


	/**
	* Get tweets from select charities
	*
	*/
	function get_tweets () {
  	Meteor.call('get_tweets', function (error, tweets) {
  		if(error) {
  			return console.error(error);
  		}

      var tweetElements = [], ele, $owl = $('#owl-example');

      tweets.forEach(function (val, indx) {
          $.ajax({
            method : 'GET',
            jsonp: "callback",
            dataType: "jsonp",
            data : {
              hide_media : true
            },
            url : 'https://api.twitter.com/1/statuses/oembed.json?url=https://twitter.com/Interior/status/' + val.id_str,
            success : function (response) {
              tweetElements.push(response.html);

              if(indx == tweets.length - 1) {
                tweetElements.forEach(function (html, indx) {
                  $owl.append('<div>' +html+ '</div>')
                })
                $owl.owlCarousel({
                  margin : 20
                });
              }
            }
          })
      });
  	})
  }

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
