(function () {
	/*****************************************************************************/
	/* category: Event Handlers */
	/*****************************************************************************/

	Template.category.events({
		'click [data-click-fitlersubcats]' : function (event) {
			var subcategory = this.toString().toLowerCase();
			var products = Session.get('original:products');

			Session.set('current:subcategory', subcategory);

			Session.set('visible:products', _.filter(products, function (item) {
				var sub = item.subcategory || "";
				return sub.toLowerCase() == subcategory;
			}));
		},
		'click [data-click-showall]' : function (event) {
			 Session.set('current:subcategory');
			Session.set('visible:products',Session.get('original:products'));
		}
 	});

	/*****************************************************************************/
	/* category: Helpers */
	/*****************************************************************************/
	Template.category.helpers({
		subcategories : function () {
			return _.uniq(_.map(Session.get('original:products'), function (item) {
				var sub = item.subcategory || "";
				return sub.toLowerCase();
			}));
		},
		products : function () {
			return Session.get('visible:products');
		},
		selected : function () {
			return this.toString() == Session.get('current:subcategory');
		}
	});

	/*****************************************************************************/
	/* category: Lifecycle Hooks */
	/*****************************************************************************/
	Template.category.onCreated(function () {});

	Template.category.onRendered(function () {
	});

	Template.category.onDestroyed(function () {
	});
})();
