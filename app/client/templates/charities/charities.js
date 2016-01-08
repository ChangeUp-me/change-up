/*****************************************************************************/
/* Charities: Event Handlers */
/*****************************************************************************/
Template.Charities.events({
});

/*****************************************************************************/
/* Charities: Helpers */
/*****************************************************************************/
Template.Charities.helpers({
	charities : function () {
		return Charities.find().fetch();
	}
});

/*****************************************************************************/
/* Charities: Lifecycle Hooks */
/*****************************************************************************/
Template.Charities.onCreated(function () {
});

Template.Charities.onRendered(function () {
	$(function() {
		if($(document).width() > 767) {
			$('.charity-logo').insertBefore('.charity-header');
		}
		$(window).resize(function() {
			if($(document).width() > 767) {
				$('.charity-logo').insertBefore('.charity-header');
			} else {
				$('.charity-header').insertBefore('.charity-logo');
			}
		});
	});
});

Template.Charities.onDestroyed(function () {
});
