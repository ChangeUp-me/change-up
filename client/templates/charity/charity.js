/*****************************************************************************/
/* Charity: Event Handlers */
/*****************************************************************************/
Template.Charity.events({
});

/*****************************************************************************/
/* Charity: Helpers */
/*****************************************************************************/
Template.Charity.helpers({
});

/*****************************************************************************/
/* Charity: Lifecycle Hooks */
/*****************************************************************************/
Template.Charity.onCreated(function () {
  $("title").text("Charity | ChangeUp");

});

Template.Charity.onRendered(function () {
});

Template.Charity.onDestroyed(function () {
  $("title").text("ChangeUp");

});
