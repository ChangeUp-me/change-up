Template.MasterLayout.events({
  'click .toggle-cart' : function () {
		if ($('#site-wrapper').hasClass('show-cart')) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-cart');
		} else {
			// Do things on Nav Open
			$('#site-wrapper').addClass('show-cart');
		}
	}
});
