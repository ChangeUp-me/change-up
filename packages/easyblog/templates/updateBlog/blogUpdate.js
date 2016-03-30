Template.blogUpdateTemplate.helpers({
  blogCategories:function(){
    var categories = orion.dictionary.get('blog.category');
    var options = [];
    options.push({'label':'General', 'value':'General'});
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
  },
  onSuccess:function(){
    return function (result) {
      sAlert.success("Blog Deleted!");
      Meteor.setTimeout(function(){
         Router.go('/admin/blog');
      }, 1000);
     };
  },
  onError:function(){
    return function(error){
      sAlert.error("Oops! something went wrong.");
    }
  }
  // beforeRemove: function () {
  //    return function (collection, id) {
  //      var doc = collection.findOne(id);
  //      if (confirm('Really delete "' + doc.title + '"?')) {
  //        this.remove();
  //      }
  //    };
  //  }
});

Template.blogUpdateTemplate.events({
  "click .deleteBtn": function(event, template){
    //
  }
});

Template.blogUpdateTemplate.onCreated(function(){
    var blogId = Router.current().params._id;
   Meteor.subscribe("singleBlog", blogId);
});

AutoForm.addHooks('blogPostUpdateForm',{
  onSuccess:function(error, result){
    console.log("Update Success!!");
  },
  onError:function(type,error){
    console.log(type +": " + error);
  }
}
);
