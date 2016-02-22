/*****************************************************************************/
/* AddProduct: Event Handlers */
/*****************************************************************************/

function parseProductForm (form) {
  return {
    name : form.name.value,
    description : form.description.value,
    price : form.price.value,
    percentToCharity : form.percentage.value,
    oneSize : $('#noSize').is(':checked'),
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
    var images = getImages();

    function getImages () {
      return $.map($('#productImages').children(), function (image, indx) {
        return Session.get('upload:image:' + $(image).attr('id'));
      });
    }

    if(image) {
      product.image = image;
    }

    if(images.length > 0) {
      product.images = images;
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
  },
  "click #noSize" : function () {
    if ($('#noSize').is(':checked')){
      $('.size-select').hide();
      $('.sizeLi').removeClass('selected');
    } else {
      $('.size-select').show();
      $('.sizeLi').removeClass('selected');
    }
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
  },
  productImages : function () {
    var images = this.images || [];
    var productImages = [];

    for(var i = 0; i < 5; i++) {
      var p = images[i] || {};
      productImages.push(p);
    }

    return productImages;
  }
});
/*****************************************************************************/
/* AddProduct: Lifecycle Hooks */
/*****************************************************************************/
Template.AddProduct.onCreated(function() {});
Template.AddProduct.onRendered(function() {
  try {
    if (this.data.oneSize) {
      $('.size-select').hide();
      $('#noSize').prop('checked', true);
      $('.sizeLi').removeClass('selected');
    }
  } catch (e) {}

  var data = this.data;

  $('#imageUpload').changeUpUpload({
    targetImage : '#targetImage',
    progressBar : '#uploadProgress',
    sessionName : 'upload:image'
  });

  var $this;
  $('#productImages').children().each(function (indx, image){
    $this = $(this);
    $this.find('input').changeUpUpload({
      targetImage : '#' + $this.find('img').attr('id'),
      progressBar : '#' + $this.find('div').attr('id'),
      sessionName : 'upload:image:' + $this.attr('id')
    })
  })

  function sliderInit (data) {
    data = data || {};

    var slider = $('input#percentToCharity');
    var target = $('#charityPerctIndicator');
    var initVal = data.percentToCharity || 50;

    console.log('the init value', data)

    target.html(initVal + '%')
    slider.val(initVal)

    slider.on('change', function (){
      target.html($(this).val() + '%')
    });
  }

  sliderInit(data);
});
Template.AddProduct.onDestroyed(function() {
  $('#productImages').children().each(function () {
    Session.set('upload:image:' + $(this).attr('id'), undefined);
  })
});
