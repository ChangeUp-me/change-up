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
  where: 'client'
});

Router.route('orders', {
  name: 'orders',
  controller: 'OrdersController',
  where: 'client'
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
  where: 'client'
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