/*****************************************************************************/
/* Vendor: Event Handlers */
/*****************************************************************************/
Template.vendorsList.events({
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

    if (cartItem.size === undefined){
      sAlert.error('select a size');
    } else if(!cartItem.charityId){
        sAlert.error('select a charity');
    } else if (cartItem.quantity < 1) {
      sAlert.error('select a quantity more than 1');
    } else if (isNaN(cartItem.quantity)) {
      sAlert.error('select a quantity');
    } else {
      CART.addItem(cartItem);
    }
  }
});

/*****************************************************************************/
/* Vendor: Helpers */
/*****************************************************************************/
Template.vendorsList.helpers({
  vendors : function () {
    return Vendors.find({}, {sort: {storeName:1}}).fetch();
  }
});

/*****************************************************************************/
/* Vendor: Lifecycle Hooks */
/*****************************************************************************/
Template.vendorsList.onCreated(function () {
  $("title").text("Vendors | Change Up");

});

Template.vendorsList.onRendered(function () {
});

Template.vendorsList.onDestroyed(function () {
  $("title").text("Change Up");

});
