/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/
Template.Admin.events({
});

Template.AddProduct.events({
});

/*****************************************************************************/
/* Admin: Helpers */
/*****************************************************************************/
Template.Admin.helpers({
});

/*****************************************************************************/
/* Admin: Lifecycle Hooks */
/*****************************************************************************/
Template.Admin.onCreated(function () {
});

Template.Admin.onRendered(function () {
});

Template.AddProduct.onRendered(function () {
	$(function() {
        $('.size-select li').click(function() {
            $(this).toggleClass("selected");
        });
    });
});

Template.Admin.onDestroyed(function () {
});
