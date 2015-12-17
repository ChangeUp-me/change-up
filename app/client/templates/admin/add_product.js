/*****************************************************************************/
/* AddProduct: Event Handlers */
/*****************************************************************************/
Template.AddProduct.events({
  "submit #addProduct" : function (event) {
    event.preventDefault();

    var form = event.target;

    var product = {
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
        return sizes;
      }()
    };

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




