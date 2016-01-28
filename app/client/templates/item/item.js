/*****************************************************************************/
/* Item: Event Handlers */
/*****************************************************************************/
Template.Item.events({
	'click .openShareWidget': function(){
			productId.set(this.product._id);
			productName.set(this.product.name);
			productDescription.set(this.product.description);
	    $('#shareModal').modal('show');
	}
});

/*****************************************************************************/
/* Item: Helpers */
/*****************************************************************************/
Template.Item.helpers({

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
