changeUpUpload = (function ($, window, document, undefined) {
	"use strict";

	/**
	* @todo
	* Required : sAlert, S3, 
	*/

	var pluginName = 'changeUpUpload';
	var defaults = {};


	/**
	* the image upload plugin
	*
	* @param DomObject element - an element (most likely an input element)
	* @param Object options - the plugin options {progressBar, targetImage}
	* @param Boolean instanceCreatedByPlugin - this lets us know if the plugin
	* created the instance or you created it manually. with "new changeUpUpload"
	*/
	function Plugin (element, options, instanceCreatedByPlugin) {
		options = options || {};
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;

		this.progressBar = this.settings.progressBar;
		this.targetImage = this.settings.targetImage;

		if(!this.progressBar) {
			throw new Error('no progressbar given');
		}

		if(!this.targetImage) {
			throw new Error('no targetimage given');
		}

		this.progressId = this.progressBar.replace(/#/g, "") + "_prog";

		this.targetImage = $(this.targetImage);
		this.progressBar = $(this.progressBar);

		this.first = true;

		this._addUploadTracker();

		if(instanceCreatedByPlugin) this.init();
	}

	$.extend(Plugin.prototype, {

		
		/**
		* this function is run as soon as the 
		* "changeUpUpload" method is called on a jQuery elmement
		* 
		* @access public
		*/
		init : function () {
			//this.otherFunc();
			var self = this;

			//when a user adds a file to the element (probably an input element)
			//attempt to upload that file
			$(self.element).on('change', function () {
				self._attemptUpload($(this)[0].files);
			});
		},


		/**
		* upload a file manulaly without having ot wait for the 
		* input to change.  this method should only be used
		* if your instantiating the plugin manually.  Ex : new changeUpUpload();
		*
		* @access public
		* @param Array files - an array of file objects
		* @param Function Callback - a callback for after files finish uploading
		*/
		upload : function (files, callback) {
			var self = this;
			callback = callback || _.noop;

			self._attemptUpload(files, callback);
		},

		/**
		* This method tracks the S3 upload progress so 
		* that we can run an animation (like a progress bar)
		* 
		* @access private
		*/
		_addUploadTracker : function () {
			var self = this;
			self.progressBar.html(self._createProgressBar());

			Tracker.autorun(function (comp) {
				var prog = S3.collection.find().fetch();
				prog = prog.length > 0 ? prog[0].percent_uploaded : 0;

				//if the input element is no longer in the document
				//(probably because the route changed)
				//than kill the tracker
				if (!$.contains(document, self.element)) {
				    comp.stop();
				    return;
				}

				if(self.first) {
					return self._hideProgressBar();
				}

				//if we have some progress show the progress bar
				if(prog > 0) {
					self._showProgressBar(prog);
				} else {
					self._hideProgressBar();
				}
			});
		},

		/**
		* Attempt to upload the image fileList object
		* to amazon s3.
		* 
		* @note - the fileList object should only contain 1 file
		*  
		* @param Array files - a fileList object
		* @param Function callback - callback after upload finishes
		*/
		_attemptUpload : function (files, callback) {
			var self = this;
			Session.set('upload:current', self.progressId);

			self._uploadImage(files, function (err, result) {
				if(err) {
					console.error('upload', err);
					return sAlert.error('image failed to upload');
				}

				self.targetImage.attr('src', result.url);
				
				//we set a session for each image so that
				//we know which image is being uploaded
				//this allows us to have multiple upload
				//elements on the same page without conflict
				self._setImageSession({
					id : result._id,
					url : result.url
				})

				self._hideProgressBar();

				if(callback) callback();

				//this just tracks the file upload progress
				//we can remove it when the upload completes
				S3.collection.remove({});
			});
		},

		/**
		* show the progress bar with the percent of the file
		* that's been uploaded
		*
		* @param Number prog - a number for the upload progress
		* 
		* @access private
		*/
		_showProgressBar : function (prog) {
			//only show progress bar for element being uploaded
			if(Session.get('upload:current') !== this.progressId)
				return;

			var bar = this.progressBar.find('.progress-bar');

			console.log('found the bar', bar);
			bar.css('width', prog + '%');
			this.progressBar.show();
		},

		/**
		* hides the progress bar
		*
		* @access private
		*/
		_hideProgressBar : function () {
			var time = this.first ? 0 : 500;

			setTimeout(function () {
				this.first = false;
				var bar = this.progressBar.find('.progress-bar');
				bar.css('width', '0%');
				this.progressBar.hide();
			}.bind(this), time);
		},


		/**
		* creates the progress bar element
		* 
		* @access private
		*/
		_createProgressBar : function () {
			var html = '';

			html += '<div class="progress">';
			html +=   '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">';
			html +=     '<span class="sr-only">0% Complete</span>';
			html +=   '</div>';
			html +=  '</div>';
			
			return html
		},

		/**
		* upload the image file to amazon S3
		*
		* @access private
		*
		* @param Object fiiles - FileList object
		* @param Function callback - callback for when upload is complete
		* or fails
		*/
		_uploadImage : function (files, callback) {
			S3.upload({
				files : files,
				path : 'images',
			}, callback)
		},

		/**
		* Set a unique identifier for the image 
		* that was uploaded.  This lets us grab
		* it later on and store the info in our
		* database
		*
		* @param Object upload - the file that was uploaded to S3
		*/
		_setImageSession : function (upload) {
			Session.set(this.settings.sessionName, {
	      fileId: upload.id,
	      url: upload.url,
	      //@todo
	      info : {
	      	width : 200,
	      	height : 200,
	      	backgroundColor : '#FFFFFF',
	      	primaryColor : '#333333',
	      	secondaryColor : '#333333'
	      }
	    });
		}
	})

	$.fn[pluginName] = function (options) {

		//this just lets us have multiple instances
		//of this plugin on the same page
		return this.each(function () {
			if(!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options, true));
			}
		});
	}
	return Plugin;

})(jQuery, window, document); 