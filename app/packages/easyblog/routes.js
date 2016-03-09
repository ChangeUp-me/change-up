// *****************************
//    Default Blog Controllers *
// *****************************
blogController = RouteController.extend({
  subscriptions:function(){
    Meteor.subscribe("blog");
  },
  data:function(){
    var postPerPage = orion.dictionary.get('blog.totalPostsPerPage');
    console.log(postPerPage);
    return {
      'Blogs':Blog.find({}, {'limit':postPerPage}).fetch()
    }
  }
});

singleBlogController = RouteController.extend({
  subscriptions:function(){
    var id = this.params.categoryId.split("-")[1];
    Meteor.subscribe("singleBlog", id);
  },
  data:function(){
      var id = this.params.categoryId.split("-")[1];
    return {
      'blog':Blog.findOne({'_id':id}),
      'seoObject':function(){
        console.log(this.blog);
        return{
          title: this.blog.title,
          meta:{
            'description':"Blog Description Goes here."
          },
          og:{
            'type':"article",
          },
          link:{
            'icon':'icon-url'
          }
        }
      }
    }
  },
  onAfterAction:function(){
    var seoObject = this.data().seoObject();
    easyBlog.dynamicSEO(seoObject);
  }
})

// *****************************
//          Routes function    *
// *****************************

easyBlog = {
  // *** Dynamic SEO *****
  'dynamicSEO': function(seo){
        if(!Meteor.isClient){
          return;
        }
        if(seo){
          SEO.set(
            seo
          );
        }
  },
  // *** To create a route *****
  'route' : function(routePath,tmpl, object){
    Router.route(routePath, function(){
            this.render(tmpl);
          },
          object
        );
  },
  //********* Static SEO **************//
  'staticSEO': function(routeName, title, metaTags){
  try{
  SeoCollection.update(
      {
          route_name: routeName
      },
      {
          $set: {
              route_name: routeName,
              title: title,
              meta: metaTags
          }
      },
      {
          upsert: true
      }
  );
  }catch(e){

  }
  }
}

// *****************************
//          Routes             *
// *****************************

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
// _-_-_-_-_-_ Static Content -_-_-_-_-
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

// Create a object with route name and controller
var object = { name: 'allBlogs', controller:'blogController'};
easyBlog.route('/blogs','allBlogs', object);
// Set the static seo by calling easyBlog.staticSEO for static content.
easyBlog.staticSEO('allBlogs', 'Easy Blog', {"description":"Easy Blog"});



// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
// _-_-_-_-_-_ Dynamic Content -_-_-_-_-
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

var object2 = { name: 'singleBlog', controller:'singleBlogController'};

// Create a route with the given object.
easyBlog.route('/blogs/:categoryId', 'singleBlog', object2);
