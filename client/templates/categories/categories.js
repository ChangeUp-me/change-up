(function () {
	/*****************************************************************************/
	/* categories: Event Handlers */
	/*****************************************************************************/

	Template.categories.events({});

	/*****************************************************************************/
	/* categories: Helpers */
	/*****************************************************************************/
	Template.categories.helpers({
		categories : function () {
			return _.uniq(Products.find(
				{category : {$exists : true}}, 
				{fields : {category : 1}}
			).fetch().map(function (x) {
				return x.category;
			}), true)
		},
		products : function () {
			var category = this.toString();
			return Products.find({
				category : category
			}, {
				limit : 3
			}).fetch();
		}
	});

	/*****************************************************************************/
	/* categories: Lifecycle Hooks */
	/*****************************************************************************/
	Template.categories.onCreated(function () {});

	Template.categories.onRendered(function () {});

	Template.categories.onDestroyed(function () {});
})();
