/*****************************************************************************/
/* reactiveCategoryAttribute: Event Handlers */
/*****************************************************************************/
Template.reactiveCategoryAttribute.events({
	"change [name='category']" : function (event) {
    var currentCategory = $(event.target).val();

    Session.set('orion:category', currentCategory);
    // Session.set('orion:subcategory', CATEGORIES[currentCategory].subcategories[0])
  }
});

/*****************************************************************************/
/* reactiveCategoryAttribute: Helpers */
/*****************************************************************************/
Template.reactiveCategoryAttribute.helpers({
	categories : function () {
		return _.map(Object.keys(CATEGORIES), function (cat) {
      return {name : cat}
    });
	},
	selected : function () {
		return this.name == Session.get('orion:category');
	}
});

/*****************************************************************************/
/* reactiveCategoryAttribute: Lifecycle Hooks */
/*****************************************************************************/
Template.reactiveCategoryAttribute.onCreated(function () {

});

Template.reactiveCategoryAttribute.onRendered(function () {
	console.log('val', this.data.value)
	try{
		Session.set('orion:category', this.data.value);
	} catch (e) {
		console.error(e);
	}

	$('#categories').select2({
		placeholder : 'Select A Category',
	})
});

Template.reactiveCategoryAttribute.onDestroyed(function () {
	Session.set('orion:category');
});
