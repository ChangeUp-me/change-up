/*****************************************************************************/
/* Shop: Event Handlers */
/*****************************************************************************/
Template.Shop.events({
	'click .like-button' : function (event) {
		var productId = this._id;
		return;

		Meteor.call('insertLike', this._id, this.vendorId, function (err, result){
			if(err){
				console.error(err);
			}
		})
	},
	'click .add-to-cart-btn' : function (event) {

	}
});

/*****************************************************************************/
/* Shop: Helpers */
/*****************************************************************************/
Template.Shop.helpers({
	products : function () {
		return [{
			_id : '1',
			vendorId : 'someid',
			name : "CMKY Shirt",
			vendorName : 'Swagtastic Gear',//@call this seperatley
			price : 42.00,
			likeCount : 23,//from another call
			reviews : [{}],
			image : {
				src : 'cmykshirt.png'
			}
		}, {
			_id : '2',
			vendorId : 'someid2',
			name : "Light Backpack",
			vendorName : 'FeelTheAir',
			price : 58.00,
			reviews : [{},{},{}],
			likeCount : 25,
			image : {
				src : 'lightbackpack.png'
			}
		}, {
			_id : '3',
			vendorId : 'someid3',
			name : "SEXY Shirt",
			vendorName : 'HipsterCostume',
			price : 62.85,
			reviews : [{}, {}],
			likeCount : 30,
			image : {
				src : 'sexyshirt.png'
			}
		}]
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
