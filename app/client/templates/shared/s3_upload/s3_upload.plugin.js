(function ($, window, document, undefined) {
	"use strict";

	/**
	* @todo
	* Required : sAlert, S3, 
	*/

	var pluginName = 'changeUpUpload';
	var defaults = {};

	function Plugin (element, options) {
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

		this.targetImage = $(this.targetImage);
		this.progressBar = $(this.progressBar);

		this.first = true;

		this.init();
	}

	$.extend(Plugin.prototype, {
		init : function () {
			//this.otherFunc();
			var self = this;
			self.progressBar.append(self._createProgressBar());

			Tracker.autorun(function (comp) {
				var prog = S3.collection.find().fetch();
				prog = prog.length > 0 ? prog[0].percent_uploaded : 0;

				if (!$.contains(document, self.element)) {
				    comp.stop();
				    return;
				}

				if(self.first) {
					return self._hideProgressBar();
				}

				if(prog > 0) {
					self._showProgressBar(prog);
				} else {
					self._hideProgressBar();
				}
			});

			$(self.element).on('change', function attempt_upload(event) {
				var files = $(this)[0].files;

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

					S3.collection.remove({});
				});
			});
		},
		_showProgressBar : function (prog) {
			var bar = this.progressBar.find('.progress-bar');
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
			Session.set('upload:image', {
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
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	}

})(jQuery, window, document); 