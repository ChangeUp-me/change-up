OrdersController = RouteController.extend({
  
  // A place to put your subscriptions
  // this.subscribe('items');
  // // add the subscription to the waitlist
  // this.subscribe('item', this.params._id).wait();
  
  subscriptions: function() {
  },
  
  // Subscriptions or other things we want to "wait" on. This also
  // automatically uses the loading hook. That's the only difference between
  // this option and the subscriptions option above.
  // return Meteor.subscribe('post', this.params._id);
  
  waitOn: function () {
    return [
      Meteor.subscribe('users'),
      Meteor.subscribe('userTransactions'),
      Meteor.subscribe('vendorTransactions')
    ]
  },
  
  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  // return Posts.findOne({_id: this.params._id});
  
  data: function () {
    var transact = Transactions.find({userId : Meteor.userId()}).fetch();
    var user = Meteor.user();
    var orders = [];
    var subTotal = 0;

    //@todo - getting an error
    user = user ? user.profile : {}

    //subscription might not be ready yet
    //@todo - add subscription to subscriptions instead
    //than call the .wait method
    if(transact) {
      //get every item in the transaction
      //and put it all in one array
      for(var i =0; i<transact.length; i++) {
        orders.push(transact[i].order)
      }
      orders = _.flatten(orders);

      var vendorIds = [];

      //get each unique vendor id
      orders.forEach(function (val) {
        if(vendorIds.indexOf(val.vendorId) < 0)
          vendorIds.push(val.vendorId);
      });

      var vendors = Vendors.find({_id : {$in : vendorIds}}).fetch();

      //get each vendor name and add to each product
      var indx;
      orders.forEach(function (order) {
        indx = vendors.findIndex(function (vendor) {
          return vendor._id == order.vendorId;
        })

        order.storeName = vendors[indx].storeName;
      });

      //add up price for each order
      var o;
      for(var i = 0; i < orders.length; i++) {
        o = orders[i];
        subTotal = subTotal +  (parseFloat(o.price) *  o.quantity);
      }
    }

    console.log('the orders', orders);

    return {
      totals : {
        subTotal : parseFloat(subTotal).toFixed(2),
        total : parseFloat(subTotal + 6).toFixed(2)
      },
      orders : orders,
      shipping : user.shipping,
      billing : user.billing
    }
  },
  
  // You can provide any of the hook options
  
  onRun: function () {
    this.next();
  },
  onRerun: function () {
    this.next();
  },
  onBeforeAction: function () {
    this.next();
  },
  
  // The same thing as providing a function as the second parameter. You can
  // also provide a string action name here which will be looked up on a Controller
  // when the route runs. More on Controllers later. Note, the action function
  // is optional. By default a route will render its template, layout and
  // regions automatically.
  // Example:
  //  action: 'myActionFunction'
  
  action: function () {
    this.render();
  },
  onAfterAction: function () {
  },
  onStop: function () {
  }
});
