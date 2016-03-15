changeUpUpload = (function ($, window, document, undefined) {
	"use strict";

	/**
	* @todo
	* Required : sAlert, S3, 
	*/

	var pluginName = 'changeUpUpload';
	var defaults = {};

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
		init : function () {
			//this.otherFunc();
			var self = this;

			$(self.element).on('change', function () {
				self._attemptUpload($(this)[0].files);
			});
		},
		upload : function (files, callback) {
			var self = this;
			callback = callback || _.noop;

			self._attemptUpload(files, callback);
		},
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
		_attemptUpload : function (files, callback) {
			var self = this;
			Session.set('upload:current', self.progressId);

			self._uploadImage(files, function (err, result) {
				if(err) {
					console.error('upload', err);
					return sAlert.error('image failed to upload');
				}

				self.targetImage.attr('src', result.url);
				
				self._setImageSession({
					id : result._id,
					url : result.url
				})

				self._hideProgressBar();

				if(callback) callback();

				S3.collection.remove({});
			});
		},
		_showProgressBar : function (prog) {
			//only show progress bar for element being uploaded
			if(Session.get('upload:current') !== this.progressId)
				return;

			var bar = this.progressBar.find('.progress-bar');

			console.log('found the bar', bar);
			bar.css('width', prog + '%');
			this.progressBar.show();
		},
		_hideProgressBar : function () {
			var time = this.first ? 0 : 500;

			setTimeout(function () {
				this.first = false;
				var bar = this.progressBar.find('.progress-bar');
				bar.css('width', '0%');
				this.progressBar.hide();
			}.bind(this), time);
		},
		_createProgressBar : function () {
			var html = '';

			html += '<div class="progress">';
			html +=   '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">';
			html +=     '<span class="sr-only">0% Complete</span>';
			html +=   '</div>';
			html +=  '</div>';
			
			return html
		},
		_uploadImage : function (files, callback) {
			S3.upload({
				files : files,
				path : 'images',
			}, callback)
		},
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
		return this.each(function () {
			if(!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options, true));
			}
		});
	}
	return Plugin;

})(jQuery, window, document); 