(function () {
	/*****************************************************************************/
	/* category: Event Handlers */
	/*****************************************************************************/

	Template.category.events({});

	/*****************************************************************************/
	/* category: Helpers */
	/*****************************************************************************/
	Template.category.helpers({
		subcategories : function () {
			return ['One', 'Two', 'Three', 'Four', 'Five'];
		},
		products : function () {
			return Products.find().fetch();
		}
	});

	/*****************************************************************************/
	/* category: Lifecycle Hooks */
	/*****************************************************************************/
	Template.category.onCreated(function () {});

	Template.category.onRendered(function () {});

	Template.category.onDestroyed(function () {});
})();
