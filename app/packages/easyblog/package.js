Package.describe({
  name: 'gpandey:easyblog',
  version: '0.0.1',
  summary: 'Blog add-on for orionjs bootstrap.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.imply('blaze-html-templates', 'client');
  api.imply([
    'blaze',
    'nicolaslopezj:reactive-templates',
    'twbs:bootstrap',
    'fortawesome:fontawesome',
    'orionjs:core',
    'orionjs:bootstrap',
    'vsivsi:orion-file-collection',
    'aldeed:tabular',
    'iron:router',
    'manuelschoebel:ms-seo',
    'less'
  ])
  api.use(['ecmascript',
  'blaze-html-templates@1.0.1',
  'blaze@2.1.3',
  'orionjs:core@1.7.0',
  'orionjs:bootstrap@1.7.0',
  'iron:router@1.0.12',
  'orionjs:attributes@1.7.0',
  'orionjs:image-attribute@1.7.0',
  'orionjs:summernote@1.7.0',
  'orionjs:collections@1.7.0',
  'aldeed:collection2@2.9.0',
  'tracker@1.0.9',
  'mongo@1.1.3',
  'less@2.5.1',
  'aldeed:tabular@1.6.0',
  'aldeed:simple-schema@1.5.3',
  'matb33:collection-hooks@0.8.1',
  'aldeed:autoform@5.8.1',
  'vsivsi:orion-file-collection@0.2.3',
  'manuelschoebel:ms-seo@0.4.1'
]);
  api.addFiles([
    'templates/easyblog.html',
    'templates/createBlog/blogCreate.html',
    'templates/createBlog/blogCreate.js',
    'templates/createBlog/blogCreate.less',
    'templates/allBlogs/allBlogs.html',
    'templates/allBlogs/allBlogs.js',
    'templates/allBlogs/allBlogs.less',
    'templates/singleBlog/singleBlog.html',
    'templates/singleBlog/singleBlog.less',
    'templates/updateBlog/blogUpdate.html',
    'templates/updateBlog/blogUpdate.js'
  ], 'client');


  api.addFiles(['easyblog.js',
    'routes.js',
  ]);
  
  api.export(['Blog','SeoCollection', 'blogController', 'easyBlog', 'singleBlogController']);
});

Package.onTest(function(api) {
  api.imply('nicolaslopezj:reactive-templates');
  api.use('ecmascript');
  api.use('tinytest');
  api.use('gpandey:easyblog');
  api.addFiles('easyblog-tests.js');
});
