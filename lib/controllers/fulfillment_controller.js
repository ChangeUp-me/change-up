FulfillmentController = RouteController.extend({

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
    var vendor;
    try{
      vendor =  Meteor.subscribe('shipments', Meteor.user().profile.vendorId);
    } catch (e) {}
    return vendor;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  // return Posts.findOne({_id: this.params._id});

  data: function () {
    var transaction = Transactions.findOne(this.params._id);
    var user = Meteor.user();
    var filtered;

    if(transaction && user) {
      var vendorId = user.profile.vendorId;
      var order = transaction.order;

      order = _.filter(order, function (item) {
        return item.vendorId == vendorId;
      })

      transaction.order = order;
      filtered = transaction;

      try{
      var vendor = Vendors.findOne({ _id : filtered.order[0].vendorId});
        var state = vendor.shipsFrom.state;
        Session.set('selected:state', state);
      } catch (e) {};
    }

    return filtered;
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
    Session.set('shipment:rates');
    Session.set('shipment:id');
  }
});
