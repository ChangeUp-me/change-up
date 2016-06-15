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
  $("title").text("About Us | ChangeUp");

  // var title = document.createElement('title');
  // title.appendChild(document.createTextNode('About | ChangeUp'));
  // document.getElementsByTagName('head')[0].appendChild(title);
});

Template.About.onRendered(function () {
});

Template.About.onDestroyed(function () {
  $("title").text("ChangeUp");

});
