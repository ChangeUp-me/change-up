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

Router.route('item', {
  name: 'item',
  controller: 'ItemController',
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