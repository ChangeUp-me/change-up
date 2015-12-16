/*****************************************************************************/
/* VendorProfile: Event Handlers */
/*****************************************************************************/
Template.VendorProfile.events({
  "submit #storeForm" : function (event) {
    event.preventDefault();
    var form = event.target;

    var store =  {
      storeName : form.storeName.value,
      storeDescription : form.storeDescription.value,
      charities : function () {
        var charities = [];
        _.forEach($('#selectlist').children(), function (val, indx){
          charities.push($(val).attr('data-id'));
        })
        return charities;
      }()
    }

    Meteor.call('insertVendor', store, function (err) {
      if(err){
        console.error(err);
        return sAlert.error(err);
      } 

      sAlert.success('vendor created!')
    })
  },

  /**
  * Remove a charity from selected charities
  */
  "click .select-list-item > img.remove-item" : function (event) {
    var arr = Session.get('selectedCharities') || [];
    var id = this.id;

    var index = arr.findIndex(function (charity, index) {
      return charity.id == id;
    });

    arr.splice(index,1);

    Session.set('selectedCharities', arr);
  }
});
/*****************************************************************************/
/* VendorProfile: Helpers */
/*****************************************************************************/
Template.VendorProfile.helpers({
  selectedCharities : function () {
    return Session.get('selectedCharities');
  }
});
/*****************************************************************************/
/* VendorProfile: Lifecycle Hooks */
/*****************************************************************************/
Template.VendorProfile.onCreated(function() {});
Template.VendorProfile.onRendered(function() {

});
Template.VendorProfile.onDestroyed(function() {


});




