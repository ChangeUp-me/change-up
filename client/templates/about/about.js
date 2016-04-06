/*****************************************************************************/
/* About: Event Handlers */
/*****************************************************************************/
Template.About.events({
});

/*****************************************************************************/
/* About: Helpers */
/*****************************************************************************/
Template.About.helpers({
});

/*****************************************************************************/
/* About: Lifecycle Hooks */
/*****************************************************************************/
Template.About.onCreated(function () {
  $("title").text("About Us | Change Up");

  // var title = document.createElement('title');
  // title.appendChild(document.createTextNode('About | Change Up'));
  // document.getElementsByTagName('head')[0].appendChild(title);
});

Template.About.onRendered(function () {
});

Template.About.onDestroyed(function () {
  $("title").text("Change Up");

});
