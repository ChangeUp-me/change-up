/*****************************************************************************/
/* Vendor: Event Handlers */
/*****************************************************************************/
Template.Vendor.events({
});

/*****************************************************************************/
/* Vendor: Helpers */
/*****************************************************************************/
Template.Vendor.helpers({
  vendorProducts : function () {
    return Products.find({'vendorId' : this._id }).fetch();
  }
});

/*****************************************************************************/
/* Vendor: Lifecycle Hooks */
/*****************************************************************************/
Template.Vendor.onCreated(function () {
});

Template.Vendor.onRendered(function () {
});

Template.Vendor.onDestroyed(function () {
});
