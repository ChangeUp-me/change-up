Template.blogUpdateTemplate.helpers({
  blogCategories:function(){
    var categories = orion.dictionary.get('blog.category');
    var options = [];

    if(categories.length > 0){
      for(i=0; i<categories.length; i++){
        options.push({'label':categories[i], 'value':categories[i]});
      }
    }
    return options;
  },
  blogDetails:function(){
    var blogId = Router.current().params._id;
    return Blog.findOne({'_id':blogId});
  }
});

Template.blogUpdateTemplate.onCreated(function(){
    var blogId = Router.current().params._id;
   Meteor.subscribe("singleBlog", blogId);
});


// Template.blogUpdate.helpers({
//   contributors: function(){
//
//   }
// });


AutoForm.addHooks('blogPostUpdateForm',{
  onSuccess:function(error, result){
    console.log("Update Success!!");
  },
  onError:function(type,error){
    console.log(type +": " + error);
  }
}
);
