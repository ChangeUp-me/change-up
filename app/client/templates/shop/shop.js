/*****************************************************************************/
/* Shop: Event Handlers */
/*****************************************************************************/
Template.Shop.events({
});

/*****************************************************************************/
/* Shop: Helpers */
/*****************************************************************************/
Template.Shop.helpers({
	products : function () {
		return [{
			vendorId : 'someid',
			name : "CMKY Shirt",
			vendorName : 'Swagtastic Gear',//@call this seperatley
			price : 42.00,
			likeCount : 23,
			reviews : [{}],
			image : {
				src : 'cmykshirt.png'
			}
		}, {
			vendorId : 'someid2',
			name : "Light Backpack",
			vendorName : 'FeelTheAir',//@call this seperatley
			price : 58.00,
			reviews : [{},{},{}],
			likeCount : 25,
			image : {
				src : 'lightbackpack.png'
			}
		}, {
			vendorId : 'someid3',
			name : "SEXY Shirt",
			vendorName : 'HipsterCostume',//@call this seperatley
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
