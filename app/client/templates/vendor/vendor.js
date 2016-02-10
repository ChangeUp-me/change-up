/*****************************************************************************/
/* Vendor: Event Handlers */
/*****************************************************************************/
Template.Vendor.events({
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
    } else if (cartItem.quantity < 1) {
      sAlert.error('select a quantity more than 1');
    } else if (isNaN(cartItem.quantity)) {
      sAlert.error('select a quantity');
    } else if (!Meteor.user()) {
      sAlert.error('please sign in');
    } else {
      CART.addItem(cartItem);
    }
  }
});

/*****************************************************************************/
/* Vendor: Helpers */
/*****************************************************************************/
Template.Vendor.helpers({
  vendorProducts : function () {
    return Products.find({'vendorId' : this._id }).fetch();
  }
});

/*****************************************************************************/
/* Vendor: Lifecycle Hooks */
/*****************************************************************************/
Template.Vendor.onCreated(function () {
});

Template.Vendor.onRendered(function () {
});

Template.Vendor.onDestroyed(function () {
});
