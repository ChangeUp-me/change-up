TransfersController = RouteController.extend({

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
    return Meteor.subscribe('allTransactions');
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  // return Posts.findOne({_id: this.params._id});

  data: function () {
    var transactions = Transactions.find({}).fetch();
    var charities = Charities.find({}).fetch();
    var vendors = Vendors.find({}).fetch()

    var finalOrders

    if(transactions && charities && vendors) {
      var orders = [];
      var transactionObj = {};

      //get every order in each transaction
      var order;
      for(var i =0; i<transactions.length; i++) {
        order = transactions[i].order;

        //loop through each order and add a transaction id
        //we're going to need this as a reference later
        order.forEach(function (item) {
          item.transactionId = transactions[i]._id;
        })

        orders.push(order)
      }

      //flatten the orders into one array
      orders = _.flatten(orders);

      //transform the transaction array into an object
      //with it's unique id as keys
      transactionObj = _.indexBy(transactions, '_id');

      //do the same for the charities and vendors
      var cs = _.indexBy(charities, '_id');
      var vd = _.indexBy(vendors, '_id');

      var t, c, v;
      finalOrders = orders.map(function (item){
        t = transactionObj[item.transactionId];
        c = cs[t.charityId];
        v = vd[item.vendorId];
        return _.extend(item, _.pick(t, 'currency','timestamp'), {
          charityName : c.name,
          storeName : v.storeName
        })
      });

    }

    return {orders : finalOrders};
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
