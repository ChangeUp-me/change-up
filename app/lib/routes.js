Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});


Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  where: 'client'
});

Router.route('shop', {
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

Router.route('news', {
  name: 'news',
  controller: 'NewsController',
  where: 'client'
});

Router.route('account', {
  name: 'account',
  controller: 'AccountController',
  where: 'client',
  onBeforeAction : check_logged_in
});

Router.route('orders', {
  name: 'orders',
  controller: 'OrdersController',
  where: 'client',
  data: function() {
    return 'My Orders';
  }
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
  where: 'client'
});

Router.route('billing', {
  name: 'billing',
  controller: 'BillingController',
  where: 'client'
});

Router.route('summary', {
  name: 'summary',
  controller: 'SummaryController',
  where: 'client'
});

Router.route('confirmation', {
  name: 'confirmation',
  controller: 'ConfirmationController',
  where: 'client'
});

Router.route('item', {
  name: 'item',
  controller: 'ItemController',
  where: 'client',
  data: function() {
    return 'Product Info';
  }
});

Router.route('reviews', {
  name: 'reviews',
  controller: 'ReviewsController',
  where: 'client'
});

Router.route('charity', {
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

Router.route('recoverPassword', {
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

Router.route('contact', {
  name: 'contact',
  controller: 'ContactController',
  where: 'client'
});

Router.route('vendor', {
  name: 'vendor',
  controller: 'VendorController',
  where: 'client'
});

Router.route('admin', {
  name: 'admin',
  controller: 'AdminController',
  where: 'client'
});

Router.route('vendorOrders', {
  name: 'vendorOrders',
  controller: 'VendorOrdersController',
  where: 'client',
  data: function() {
    return 'Orders';
  }
});

Router.route('fulfillment', {
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
  where: 'client',
  data: function() {
    return 'Profile';
  }
});

Router.route('addCharity', {
  name: 'addCharity',
  controller: 'AddCharityController',
  where: 'client',
  data: function() {
    return 'Add Charity';
  }
});

Router.route('addProduct', {
  name: 'addProduct',
  controller: 'AddProductController',
  where: 'client',
  data: function() {
    return 'Add Product';
  }
});


function check_logged_in() {
  if (!Meteor.userId()) {
    this.redirect('/login');
  } else {
    this.next();
  }
}
