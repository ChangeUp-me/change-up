Template.registerHelper("makeLink", function(string){
  var link = string.replace(/[\_\s\/\.\?\!]/g, "-");

  return link;
});

Template.registerHelper("getAuthor", function(id){
  Meteor.subscribe("userProfile", id);
  return Meteor.users.findOne({'_id':id}).profile.name;
});

Template.registerHelper("formatDate", function(dateValue){
  var newDate = new Date(dateValue);
  return newDate.toLocaleDateString()
});


Template.registerHelper("linkDate", function(dateValue){
  var newDate = new Date(dateValue);
  newDate = newDate.toLocaleDateString().replace(/[\/]/g, "-");
  return newDate;
});

Template.allBlogsTemplate.events({
  "click .blogId": function(event, template){
    var id = event.currentTarget.getAttribute('id');
    Session.set('blogId', id);
     console.log(id);
  }
});
Template.allBlogsTemplate.helpers({
  'getText':function(htmlContent){
    var htmlContainer = document.createElement("div");
    htmlContainer.innerHTML = htmlContent;

    return htmlContainer.textContent.substr(0,150).trim() + "...";
  }
});
