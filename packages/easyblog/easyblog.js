// *********************************
//      Static Seo Collection      *
// *********************************
SeoCollection = new Mongo.Collection('seocollection');


// *********************************
//      Orion Blog Collection      *
// *********************************
Blog = new orion.collection('blog',{
  singularName:'Blog',
  pluralName:'Blogs',
  title:'Blogs',
  link:{
    index:3,
    title:'Blog'
  },
  tabular:{
    columns:[
      {
        data:'title',
        title:"Title"
      },
      {
        data:'category',
        title:'Category'
      },
      {
        data:'createdBy',
        title:'Author',
        render:function(value){
          if(Meteor.isClient){
            Meteor.subscribe("userProfile", value);
            return Meteor.users.findOne({'_id':value}) &&
            Meteor.users.findOne({'_id':value}).profile &&
            Meteor.users.findOne({'_id':value}).profile.name;
          }
        }
      },
      {
        data:'createdAt',
        title:'Date',
        render:function(value){
          var newDate = new Date(value);
          return newDate.toLocaleDateString();
        }
      },
      { data:'online',
        title: "Online",
        tmpl: Meteor.isClient && Template.checkbox,
        tmplContext: function (rowData) {
          return {
            item: rowData,
            column: 'online'
          };
        }
      },
      {
        tmpl:Meteor.isClient && Template.deleteBlog
      }
    ]
  }
});

// ************************************
//              Blog Schema           *
// ************************************
Blog.attachSchema(new SimpleSchema ({
  title:{
    type:String,
    label:"Blog Title",
  },
  category:{
    type:String,
    label:"Blog Category",
    optional:true,
    defaultValue:'General'
  },
  // contributor:{
  //   type:String,
  //   label:"Contributor",
  //   optional:true
  // },
  thumbnail:orion.attribute("image", {
    label:"Thumbnail Image",
    optional:true
  }),
  mainPicture:orion.attribute("image", {
    label:"Main Picture",
    optional:true
  }),
  blogContent:orion.attribute('summernote',{
    label:"Blog Content",
    optional:true
  }),
  createdBy:orion.attribute('createdBy'),
  createdAt:orion.attribute('createdAt'),
  online:{
    type:String,
    optional:true,
    autoform:{
      type:"hidden"
    },
    defaultValue:""
  }
}));



// *******************************
//      Dictionary for Blog      *
// *******************************
orion.dictionary.addDefinition('category', 'blog',{
  type:[String],
  label:'Blog Category',
});

orion.dictionary.addDefinition('totalPostsPerPage', 'blog',{
  type:Number,
  label:'Maximum number of Posts in the Main Page',
});



// *******************************************
// Custom blog templates - ReactiveTemplates *
// *******************************************
ReactiveTemplates.set('collections.blog.create', 'blogCreate');
ReactiveTemplates.set('collections.blog.update', 'blogUpdate');



// ****************************************
//                Client                  *
// ****************************************
if(Meteor.isClient){
Meteor.subscribe("blog");
console.log("Test");
console.log(Blog.find().fetch());


// sAlert configuration
Meteor.startup(function () {

    sAlert.config({
        effect: '',
        position: 'top',
        timeout: 1000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });

});
}



// ****************************************
//                Server                  *
// ****************************************
if(Meteor.isServer){
  Meteor.publish("blog", function() {
    return Blog.find({'online':"checked"});
  });
  Meteor.publish('userProfile', function(id){
    return Meteor.users.find({'_id':id}, {'fields':{'services':0}});
  })

  Meteor.publish("singleBlog", function(id){
    return Blog.find({'_id':id});
  });

  Blog.allow({
    insert: function(){
      return true;
    },
    update: function(){
      return true;
    },
    remove: function(){
      return true;
    }
  });
  console.log("Testing");

  console.log(Blog.find({}).count());
  console.log(Meteor.users.findOne({'_id':this.userId}));
}
