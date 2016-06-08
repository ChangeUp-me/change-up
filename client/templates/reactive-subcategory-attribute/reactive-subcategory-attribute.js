/*****************************************************************************/
/* reactiveSubcategoryAttribute: Event Handlers */
/*****************************************************************************/
Template.reactiveSubcategoryAttribute.events({
	"change [name='subcategory']" : function (event) {
    var currentSub = $(event.target).val();


    Session.set('orion:subcategory', currentSub);
  }
});

/*****************************************************************************/
/* reactiveSubcategoryAttribute: Helpers */
/*****************************************************************************/
Template.reactiveSubcategoryAttribute.helpers({
	subcategories : function () {
		var cats = CATEGORIES[Object.keys(CATEGORIES)[0]];
		var setCategory = Session.get('orion:category');

		//find the category in the categories object
		//if the user has already selected it
		if(setCategory) {
			var indx;
			for(var prop in CATEGORIES) {
				if(prop.toLowerCase() == setCategory.toLowerCase()) {
					indx = prop;
					break;
				}
			}
			cats = CATEGORIES[indx];
		}

    return _.map(cats.subcategories, function (sub) {
      return {name : sub};
    })
  },
	selected : function () {
		return this.name == Session.get('orion:subcategory');
	}
});

/*****************************************************************************/
/* reactiveSubcategoryAttribute: Lifecycle Hooks */
/*****************************************************************************/
Template.reactiveSubcategoryAttribute.onCreated(function () {

});

Template.reactiveSubcategoryAttribute.onRendered(function () {
	try{
		Session.set('orion:subcategory',  this.data.value);
	} catch (e) {
		console.error(e);
	}

	Meteor.setTimeout(function () {
		$('#subcategories').select2({placeholder : 'Select A Subcategory'})
	},100)
});

Template.reactiveSubcategoryAttribute.onDestroyed(function () {
	Session.set('orion:subcategory');
});
