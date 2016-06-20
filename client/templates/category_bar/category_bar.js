(function () {
	var interval;



	/*****************************************************************************/
	/* categoryBar: Event Handlers */
	/*****************************************************************************/
	Template.categoryBar.events({
		'click .ci-main-title' : function (event) {
			var element = $(event.target);

			element.parent().children().not('.ci-main-title').toggle();
		}
	});

	/*****************************************************************************/
	/* categoryBar: Helpers */
	/*****************************************************************************/
	Template.categoryBar.helpers({
		categories : function () {
			return Object.keys(CATEGORIES);
		},
		subcategories : function () {
			try{
				return _.map(CATEGORIES[this].subcategories, function (sub) {
					return {category : this, name : sub};
				}.bind(this))
			} catch(e) {}
			
			return [];
		}
	});

	/*****************************************************************************/
	/* categoryBar: Lifecycle Hooks */
	/*****************************************************************************/
	Template.categoryBar.onCreated(function () {

	});

	Template.categoryBar.onRendered(function () {
		var categoryBar = $('#category-nav');
		var navBar = $('#navbar');
		var navHeight;
		var scrollPos;
		var categoryBarPos = categoryBar.offset().top - navBar.outerHeight();

		//@todo - cleanup after category bar is destroyed

		$(window).on('resize', function () {
			categoryBarPos = categoryBar.offset().top - navBar.outerHeight();
		});

		$(window).on('scroll', function (event) {
			scrollPos = $(window).scrollTop()
			if(scrollPos >= categoryBarPos && $(window).width() > 700) {
				categoryBar.addClass('stick').css({
					top : scrollPos
				});
				$('.push').addClass('active');
			} else {
				categoryBar.removeClass('stick');
				$('.push').removeClass('active');
			}
		})
	});

	Template.categoryBar.onDestroyed(function () {
		$('.push').removeClass('active');
	});
})();
