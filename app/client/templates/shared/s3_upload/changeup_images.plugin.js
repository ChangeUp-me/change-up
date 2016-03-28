changeupCropper = (function($, window, document, undefined) {
  "use strict";

  function changeupCropper(cropZone) {
    this.$image;
    this.$cropArea = $(cropZone);
  }

  //extend
  changeupCropper.prototype = _.extend(changeupCropper.prototype, {
    startCropper: function(image) {
      if (!image)
        return console.error('no image given');

      var self = this;

      self.$cropArea.append(self._getCropperHtml())

      $('#cropsavebtn').on('click', function() {
      	var image = self._getData();

      	//transform the image into a blob so that 
      	//we can create a file object out of it
      	//amazon s3 only accepts file list objects
        var blob = dataURItoBlob(image);
        var ext = blob.type.split('/')[1];
        var files = [new File([blob], "image." + ext)];

        //add a dummy FileList method incase s3
        //calls it internally.  
        //@todo - if there's a better way to create a
        //FileList object, we should do that
        files.item = function(index) {
          return files[0];
        };

        self._destroy();
        self.onSave.call(null, image, files);
      })

      //if the image is a file object than parse
      //it with teh upload reader
      if (_.isObject(image)) {
        uploadReader(image, function(image) {
          var img = document.createElement('img');
          img.setAttribute('src', image);

          //append image to crop zone
          $('#cropzone').append(img);

          //call the before crop function
          self.onBeforeCrop();

          //start cropping the image
          self.$image = $(img).cropper(cropSettings());
        })
      } else {
        $('#cropzone').append(image);
        self.onBeforeCrop();
        self.$image = $(image).cropper(cropSettings());
      }
    },
    _destroy: function() {
      this.$image.cropper('destroy');
      $('#cropzone').remove();
    },
    _getData: function(callback) {
      return this.$image.cropper('getCroppedCanvas', {
      	width : 473,
      	height : 348
      }).toDataURL();
    },
    _getCropperHtml: function() {
      var html = "";
      html += "<div id='cropzone' class='crop-zone'>";
      html += "<button id='cropsavebtn' type='button' class='crop-save-btn button blue'>Save</button>"
      html += "</div>"
      return html;
    },
    onBeforeCrop: function() {}, // user implements this method
    onSave: function(data) {}, //user implements this method
  });

  function cropSettings() {
    return {
      aspectRatio: 1.36,
      movable: true,
      zoomable: true,
      zoomOnTouch: false,
      zoomOnWheel: true,
      autoCrop: true,
      minCanvasWidth: 298,
      minCanvasHeight: 219,
      responsive: true,
      minContainerHeight: 400,
      minCropBoxWidth : 298,
    }
  }

  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
      type: mimeString
    });
  }

  function uploadReader(file, callback) {
    var reader = new FileReader();

    reader.onload = function(evt) {
      callback(evt.target.result)
    };
    reader.readAsDataURL(file);
  }

  return changeupCropper;
})(jQuery, window, document);