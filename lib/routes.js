Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.onAfterAction(function(){
  if (this.ready()){
    Meteor.isReadyForSpiderable = true;
  }
});

Router.route('/', {
  name: 'shop',
  controller: 'ShopController',
  where: 'client'
});

Router.route('charities', {
  name: 'charities',
  controller: 'CharitiesController',
  where: 'client'
});

Router.route('about', {
  name: 'about',
  controller: 'AboutController',
  where: 'client'
});

Router.route('account', {
  name: 'account',
  controller: 'AccountController',
  where: 'client',
  onAfterAction : function(){
    check_logged_in
    var user = this.data();
    if(user) {
      SEO.set({
        title: (user.profile.name || "My Account") + " | Change Up",
      });
    } else {
      this.redirect('/login');
    }
  }
});

Router.route('orders', {
  name: 'orders',
  controller: 'OrdersController',
  where: 'client',
});

Router.route('cart', {
  name: 'cart',
  controller: 'CartController',
  where: 'client'
});

Router.route('checkout', {
  name: 'checkout',
  controller: 'CheckoutController',
  where: 'client'
});

Router.route('shipping', {
  name: 'shipping',
  controller: 'ShippingController',
  where: 'client',
  onAfterAction : function(){
    if (!Meteor.user()) {
      this.redirect('/register');
      Session.set('redirectedFrom', 'shipping');
    }
  }
});

Router.route('billing', {
  name: 'billing',
  controller: 'BillingController',
  where: 'client',
  onAfterAction : function(){
    if (!Meteor.user()) {
      this.redirect('/');
    }
  }
});

Router.route('summary', {
  name: 'summary',
  controller: 'SummaryController',
  where: 'client',
  onAfterAction : function(){
    if (!Meteor.user()) {
      this.redirect('/');
    }
  }
});

Router.route('confirmation/:_id', {
  name: 'confirmation',
  controller: 'ConfirmationController',
  where: 'client'
});

Router.route('item/:_id', {
  name: 'item',
  controller: 'ItemController',
  where: 'client',
  onAfterAction : function(){
    var item = this.data();
    if (!Meteor.isClient) {
      return;
    }
    if(item){
      SEO.set({
        title: item.pageTitle + " | Change Up",
      });
    }
  }
});

Router.route('reviews/:_id', {
  name: 'reviews',
  controller: 'ReviewsController',
  where: 'client'
});

Router.route('charity/:_id', {
  name: 'charity',
  controller: 'CharityController',
  where: 'client'
});

Router.route('login', {
  name: 'login',
  controller: 'LoginController',
  where: 'client'
});

Router.route('register', {
  name: 'register',
  controller: 'RegisterController',
  where: 'client'
});

Router.route('request', {
  name: 'request',
  controller: 'RequestController',
  where: 'client'
});

Router.route('reset-password/:id', {
  name: 'recoverPassword',
  controller: 'RecoverPasswordController',
  where: 'client'
});

Router.route('forgotPassword', {
  name: 'forgotPassword',
  controller: 'ForgotPasswordController',
  where: 'client'
});

Router.route('changePassword', {
  name: 'changePassword',
  controller: 'ChangePasswordController',
  where: 'client'
});

Router.route('legal', {
  name: 'legal',
  controller: 'LegalController',
  where: 'client'
});

Router.route('contact', {
  name: 'contact',
  controller: 'ContactController',
  where: 'client'
});

Router.route('vendors', {
  name: 'vendorsList',
  where: 'client'
});

Router.route('vendors/:vendorId', {
  name: 'vendor',
  controller: 'VendorController',
  where: 'client',
  onAfterAction:function(){
    var vendor = this.data();
    if (!Meteor.isClient) {
      return;
    }
    if(vendor){
      SEO.set({
        title: vendor.storeName + " | Change Up",
        meta: {
          'description': vendor.storeDescription
        },
        og: {
          'type': 'article',
          'article:author': "Change Up",
          'title': vendor.storeName+ " | Change Up",
          'description': vendor.storeDescription,
        }
      });
    }
  }
});

Router.route('transfers', {
  name : 'transfers',
  controller : 'TransfersController',
  where : 'client'
})

Router.route('vendorOrders', {
  name: 'vendorOrders',
  controller: 'VendorOrdersController',
  where: 'client'
});

Router.route('vendorStatements', {
  name: 'vendorStatements',
  controller: 'VendorStatementsController',
  where: 'client'
});

Router.route('fulfillment/:_id', {
  name: 'fulfillment',
  controller: 'FulfillmentController'
});

Router.route('vendorProducts', {
  name: 'vendorProducts',
  controller: 'VendorProductsController',
  where: 'client',
  data: function() {
    return 'My Products';
  }
});

Router.route('vendorProfile', {
  name: 'vendorProfile',
  controller: 'VendorProfileController',
  where: 'client'
});

Router.route('addCharity', {
  name: 'addCharity',
  controller: 'AddCharityController',
  where: 'client',
  data: function() {
    return 'Add Charity';
  }
});

Router.route('addProduct/:_id?', {
  name: 'addProduct',
  controller: 'AddProductController',
  where: 'client',
});

Router.route('admin/report', {
  name: 'adminReports',
  where: 'client'
});


function check_logged_in() {
  if (!Meteor.userId()) {
    this.redirect('/login');
  }
}
