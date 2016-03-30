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
  // 'getText':function(htmlContent){
  //   var htmlContainer = document.createElement("div");
  //   htmlContainer.innerHTML = htmlContent;
  //   if(htmlContainer.textContent.substr(0,150)){
  //   var text = htmlContainer.textContent.substr(0,150).trim() + "...";
  //   return text;
  //   }else{
  //   return htmlContainer.textContent;
  //   }
  // },
  // 'checkBlog' (htmlContent){
  //   var htmlContainer = document.createElement("div");
  //   htmlContainer.innerHTML = htmlContent;
  // console.log(htmlContainer.textContent);
  // ;
  //   if(htmlContainer.textContent === ""){
  //     return "text-danger";
  //   }
  //   else{
  //     return false;
  //   }
  // },
  'pageNumber':function(){
    var totalLength = Blog.find({'online':"checked"}).fetch().length;
    if(orion.dictionary.get('blog.totalPostsPerPage')){
    var maxNumPerPage = orion.dictionary.get('blog.totalPostsPerPage');
    }else{
      maxNumPerPage = 5;
    }
    var totalPages = Math.ceil(totalLength/maxNumPerPage);
    var pageNumbers = [];
    for(i=1; i <= totalPages; i++){
      pageNumbers.push(i);
    }
    return pageNumbers;
  },
  'authorsBlog':function(){
    var currentRouter = Router.current();
    var author = currentRouter.params.query.author;
    if(author){
    var authorId = Meteor.users.findOne({'profile.name':author}) && Meteor.users.findOne({'profile.name':author})._id;
    console.log(authorId);
    var authorsBlogs = Blog.find({'createdBy':authorId}).fetch();
    console.log(authorsBlogs);
    if(author === undefined){
      return false;
    }else{
      console.log({'author': author, 'blogs':authorsBlogs});
      return {'author': author, 'blogs':authorsBlogs};
    }
  }
},
  'blogCategory':function(){
    var currentRouter = Router.current();
    var category = currentRouter.params.query.category;
    var allBlogs = Blog.find({'category':category}).fetch();
    return {'category':category, 'blogs':allBlogs};
  },
  'query':function(string){
    var currentRouter = Router.current();
    if(currentRouter.params.query[string]){
      return true;
    }
    else if (string.search('/') != -1){
      string = string.split("/");
      if(currentRouter.params.query[string[0]] === undefined && currentRouter.params.query[string[1]] === undefined){
        return true;
      }
    }else{
      return false;
    }
  }
});
