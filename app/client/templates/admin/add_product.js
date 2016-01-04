/*****************************************************************************/
/* AddProduct: Event Handlers */
/*****************************************************************************/

function parseProductForm (form) {
  return {
    name : form.name.value,
    description : form.description.value,
    price : form.price.value,
    shippingPrice : form.shippingPrice.value,
    percentToCharity : form.percentage.value,
    sizes : function () {
      var sizes = [];
      $('.size-select li.selected').each(function (indx, val) {
        sizes.push($(this).text());
      })
      console.log('the size', sizes);
      return sizes;
    }()
  };
}

Template.AddProduct.events({
  "submit #updateProduct" : function (event) {
    event.preventDefault();
    var form = event.target;
    var product = parseProductForm(form);

    Meteor.call('updateProduct', this._id, product, function (err) {
      if(err)
        return sAlert.error(err);

      sAlert.success('product updated');
    });
  },
  "submit #addProduct" : function (event) {
    event.preventDefault();
    var form = event.target;
    var product = parseProductForm(form);

    Meteor.call('insertProduct', product, function (err) {
      if(err) {
        sAlert.error(err);
       return console.error(err);
      }

      sAlert.success('product created');
    });
  },
  "click .size-select li" : function (event) {
    $(event.target).toggleClass('selected');
  }
});
/*****************************************************************************/
/* AddProduct: Helpers */
/*****************************************************************************/
Template.AddProduct.helpers({
  sizes : function () {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  },
  selectedSizes : function () {
    if(this.sizes) {
      var sizes = this.sizes;
      var text;
      console.log(this);
      var domSizes = $('.size-select li').each(function (indx, val) {
        text = $(this).text().toUpperCase();

        if(sizes.indexOf(text) > -1) {
          $(this).addClass('selected');
        }
      })
    }
  }
});
/*****************************************************************************/
/* AddProduct: Lifecycle Hooks */
/*****************************************************************************/
Template.AddProduct.onCreated(function() {});
Template.AddProduct.onRendered(function() {

});
Template.AddProduct.onDestroyed(function() {


});




