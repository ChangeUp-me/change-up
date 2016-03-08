Template.blogTemplate.onCreated(function(){
  Meteor.subscribe("blog");
});

Template.blogTemplate.helpers({
  blogCategories: function(){
    var categories = orion.dictionary.get('blog.category');
    var options = [];
    for(i=0; i<categories.length; i++){
      options.push({'label':categories[i], 'value':categories[i]});
    }
    return options;
  }
});


// Template.blogCreate.helpers({
//   contributors: function(){
//     return [
//       {'label':"Ram", 'value':"ram's ID"},
//       {'label':"Shyam", 'value':"shyam's id"},
//       {'label':"Hari", 'value':"hari's id"},
//     ]
//   }
// });


Template.checkbox.helpers({
  'onlineStatus': function(){
    console.log(this);
    return this.item.online;
  }
});



Template.checkbox.events({
  "click input.blog-checkbox": function(event, template){
    var click = $(event.currentTarget).prop('checked');
    console.log(click);
    console.log(this.item._id);
    if (click === true){
      orion.collections.list.blog.update({'_id': this.item._id},{$set: {online:"checked"}});
    }

    if(click === false){
      orion.collections.list.blog.update({'_id':this.item._id}, {$set: {online:""}});
    }
  }
});
