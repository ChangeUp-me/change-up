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

    if (product.price == "" || product.price < 1) {
      sAlert.error("please put a price greater than $1");
    } else {

      Meteor.call('insertProduct', product, function (err) {
        if(err) {
          sAlert.error(err);
          return console.error(err);
        }

        Router.go('vendorProducts');
      });
    }


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

  var cropper = new changeupCropper($('#crophere'));

  var upload = new changeUpUpload($('#imageUpload')[0], {
    targetImage : '#targetImage',
    progressBar : '#uploadProgress',
    sessionName : 'upload:image'
  })

  //call this before the cropper element is created
  cropper.onBeforeCrop = function () {
    $('#targetImage').hide();
    $('#uploadtext').hide();
  };

  //when a user clicks the save button
  cropper.onSave = function (image, files) {
   $('#targetImage').attr('src',image).show().css('opacity', .5);

   //upload the files to amazon s3
   upload.upload(files, function on_upload_finished () {
    $('#targetImage').css('opacity', 1);
   });
  };

  //when a user uploads an image start the cropper
  $('#imageUpload').on('change', function (event) {
    console.log($(this)[0].files);
    cropper.startCropper(event.currentTarget.files[0]);
  });

  $('#productImages').children().each(function (indx, image){
    var $this = $(this);
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
    var initVal = data.percentToCharity || 10;

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