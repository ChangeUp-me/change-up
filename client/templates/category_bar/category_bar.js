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
	Template.categoryBar.onCreated(function () {});

	Template.categoryBar.onRendered(function () {});

	Template.categoryBar.onDestroyed(function () {});
})();
