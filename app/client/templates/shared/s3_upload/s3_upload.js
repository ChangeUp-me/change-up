/*****************************************************************************/
/* s3Upload: Event Handlers */
/*****************************************************************************/
Template.s3Upload.events({
  "change input.file_bag": function(){
    var files = $("input.file_bag")[0].files;
    var target = $('img#targetImage');

    if (files.length != 1) return;

		orion.helpers.getBase64Image(files[0], function(base64) {
			var upload = orion.filesystem.upload({
			  fileList: files,
			  name: files[0].name,
			  uploader : 'image-attribute'
			});

			sAlert.info('uploading image...');

			Tracker.autorun(function () {
			  if (upload.ready()) {
			  	if(upload.error) {
			  		console.error('upload-error', upload);
			    	return sAlert.error('upload failed');
			  	} else {
			  		//setting a timeout to prevent decoding 
			  		//before the image is ready
			  		Meteor.setTimeout(function () {
			  			var information = orion.helpers.analizeColorFromBase64(base64);
			  		
				  		Session.set('upload:image', {
	              fileId: upload.fileId,
	              url: upload.url,
	              info: information
	            })

	            target.addClass('new-upload').attr('src', upload.url);
			  		}, 200)
			  	}
			  }
			});
			Tracker.autorun(function () {
			  var progress = upload.progress();
			  console.log(progress);
			});
		});
   }
});

/*****************************************************************************/
/* s3Upload: Helpers */
/*****************************************************************************/
Template.s3Upload.helpers({
	"files": function(){
    return S3.collection.find();
  }
});

/*****************************************************************************/
/* s3Upload: Lifecycle Hooks */
/*****************************************************************************/
Template.s3Upload.onCreated(function () {
});

Template.s3Upload.onRendered(function () {
});

Template.s3Upload.onDestroyed(function () {
});
