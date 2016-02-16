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
      return sizes;
    }()
  };
}

Template.AddProduct.events({
  "submit #updateProduct" : function (event) {
    event.preventDefault();
    var form = event.target;
    var product = parseProductForm(form);
    var image = Session.get('upload:image');

    if(image) {
      product.image = image;
    }

    Meteor.call('updateProduct', this._id, product, function (err) {
      if(err)
        return sAlert.error(err);

      Router.go('vendorProducts');
    });
  },
  "submit #addProduct" : function (event) {
    event.preventDefault();
    var form = event.target;
    var product = parseProductForm(form);
    var image = Session.get('upload:image');

    if(image) {
      product.image = image;
    } else {
      return sAlert.error('product must have an image');
    }

    Meteor.call('insertProduct', product, function (err) {
      if(err) {
        sAlert.error(err);
       return console.error(err);
      }

      Router.go('vendorProducts');
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
    var sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    var selfSizes = this.sizes;

    //if the user has sizes set make them uppercase
    if(selfSizes) {
      selfSizes = selfSizes.map(function (size) {
        return size.toUpperCase();
      })
    }

    sizes = sizes.map(function (size) {
      if(selfSizes && selfSizes.indexOf(size) > -1)
         return {size : size, selected : true};
      else
        return {size : size, selected : false};
    })

    return sizes;
  }
});
/*****************************************************************************/
/* AddProduct: Lifecycle Hooks */
/*****************************************************************************/
Template.AddProduct.onCreated(function() {});
Template.AddProduct.onRendered(function() {

  $('#imageUpload').changeUpUpload({
    targetImage : '#targetImage',
    progressBar : '#uploadProgress'
  })

  function sliderInit () {
    var slider = $('input#percentToCharity');
    var target = $('#charityPerctIndicator');
    var data = this.data || {};
    var initVal = (data.percentToCharity || 50);

    target.html(initVal + '%')
    slider.val(initVal)

    slider.on('change', function (){
      target.html($(this).val() + '%')
    });
  }

  sliderInit();
});
Template.AddProduct.onDestroyed(function() {


});
