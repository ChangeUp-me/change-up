Template.productItems.events({
  'submit [data-submit-additemtocart]': function(event, template){
    event.preventDefault();
    var selectedSize;
    var form = event.target;

    var getSize = function () {
      var size;
      try{
        size = form.size.value;
      }catch(e) {}

      return size;
    }

    var cartItem = {
      productId : this._id,
      size : getSize(),
      quantity : parseInt(form.quantity.value),
      image : this.image,
      charityId: form.charity.value
    };


    if (cartItem.quantity < 1) {
      sAlert.error('select a quantity more than 1');
    } else if(!cartItem.charityId){
      sAlert.error('select a charity');
    } else if (isNaN(cartItem.quantity)) {
      sAlert.error('select a quantity');
    } else if (this.sizes.length !== 0 && cartItem.size === undefined && !this.oneSize) {
      sAlert.error('select a size');
    }  else {
      CART.addItem(cartItem);
    }
  }
});