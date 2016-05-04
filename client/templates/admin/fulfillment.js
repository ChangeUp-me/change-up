/*****************************************************************************/
/* Fulfillment: Event Handlers */
/*****************************************************************************/
Template.Fulfillment.events({
  "click [data-click-openintegrationmodel]" : function (event) {
    event.preventDefault();

    $('#shipping-account-created').modal('show');
  },
	"submit #shippingForm" : function (event) {
		event.preventDefault();

		var form = event.target;

		var parcelInfo = {
      weight : form.weight.value,
      length : form.length.value,
      width : form.width.value,
      height : form.height.value,
		};

    var shippingFrom = {
      street : form.street.value,
      city : form.city.value,
      zipcode : form.zipcode.value,
      country : form.country.value,
      state : form.state.value  
    }

    try{
      var nonEmptyString = Match.Where(function (x) {
        check(x, String);
        return x.length > 0;
      });

      check(parcelInfo, {
        weight : nonEmptyString,
        length : nonEmptyString,
        width : nonEmptyString,
        height:  nonEmptyString
      });

      check(shippingFrom, {
        street : nonEmptyString,
        city : nonEmptyString,
        zipcode : nonEmptyString,
        country : nonEmptyString,
        state : nonEmptyString 
      });
    } catch (e) {
      console.log('e', e);
      return sAlert.error('the ' + e.path + " is invalid");
    }

		var transactionId = this._id

		sAlert.info('fetching shipping labels.  Hold on...');

		$('button[data-click-getlabel]').prop('disabled', true);

    Session.set('shipment:rates',[]);

		Meteor.call('getShippingRates', transactionId, parcelInfo, shippingFrom, function (err, shipmentLabels){
			$('button[data-click-getlabel]').prop('disabled', false);
			if(err) {
				console.error(err);
				return sAlert.error(err);
			}

			console.log(shipmentLabels);

			Session.set('shipment:rates', shipmentLabels);
		});
	},
	"click [data-click-cancel]" : function (event) {
		var ids = _.pluck(this.order, 'orderId');

		Meteor.call('cancelOrder', this._id, ids, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error('order could not be cancelled');
			}
			Meteor.setTimeout(function () {
				Router.go('vendorOrders');
			},1000)
			sAlert.success('order cancelled');
		})
	},
	"click [data-click-fulfill]" : function (event) {
		var ids = _.pluck(this.order, 'orderId');

		Meteor.call('fulfillOrder', this._id, ids, function (err) {
			if(err){
				console.error(err);
				return sAlert.error('order could not be fulfilled');
			}

			sAlert.success('order fulfilled');
		});
	},
	'change [data-onchange-carrier]' : function (event) {
    var target = event.target;
    var carrier = $(target).val();

    Session.set('selected:carrier', carrier.toLowerCase());

    //reparse the carrier select element
    $(target).select2({
      placeholder : 'Select A template'
    })

    var inputs = ['width','height','length'];

    //reset all parsel info input fields
    $('#distanceunit').val("").trigger('change');
    inputs.forEach(function (val) {
      $('input[name="' + val + '"]').val("");
    })
  },
  'change [data-onchange-parcel]' : function (event) {
    var parcelTemplate = JSON.parse($(event.target).val());

    if(!_.isObject(parcelTemplate)) return;
    
    var inputs = ['width','height','length'];

    $('#distanceunit').val(parcelTemplate.distanceUnit).trigger('change');

    inputs.forEach(function (val) {
      $('input[name="' + val + '"]').val(parcelTemplate[val]);
    });
  },
});

/*****************************************************************************/
/* Fulfillment: Helpers */
/*****************************************************************************/
Template.Fulfillment.helpers({
	rateLables : function () {
		return Session.get('shipment:rates');
	},
	toJson : function () {
    return JSON.stringify(this);
  },
  usStates : function () {
  	return States.find().fetch();
  },
  stateIsSelected : function (state) {
    return Session.get('selected:state') == state ? true : false; 
  },
  carriers : function () {
    var parcelInfo = this.parcelInfo || {};

    //@todo - only usps works right now
    //var templates = PARCEL_TEMPLATES;

    var templates = {usps : []};

    //set the selected carrier to whatever is in the DB
    var carriers = _.map(templates, function (val, indx) {
      var obj = {value : indx, selected : false}
      if(parcelInfo.carrier == indx) {
        obj.selected = true;
        if(!Session.get('selected:carrier')) {
          Session.set('selected:carrier', indx.toLowerCase());
        }
      }
      return obj;
    })

    //if the user hasn't selected a carrier yet
    //than set it to the first one in the object
    if(!Session.get('selected:carrier')) {
      Session.set('selected:carrier', Object.keys(templates)[0])
    }
    return carriers;
  },
   parcelTemplates : function () {
    //only return the templates for the selected carrier
    return PARCEL_TEMPLATES[Session.get('selected:carrier')] || [];
  }, 
	totals : function () {
		try {
			var shipping = 0;
			var total = 0;
			var order = this.order;
			var subTotal = 0;

			for (var i = 0; i < order.length; i++) {
				subTotal += parseFloat(order[i].price * order[i].quantity);
			}

			if (order[0].shippingPrice){
				shipping = Number(order[0].shippingPrice);
			}

			subTotal = parseFloat(subTotal).toFixed(2);
			shipping = parseFloat(shipping).toFixed(2);
			total = parseFloat(Number(subTotal)+Number(shipping)).toFixed(2);

			return {
				"subTotal" : subTotal,
				"shipping" : shipping,
				"total" : total
			}
		} catch (e) {

		}
	},
	isFulfilled : function () {
		try {
			var order = this.order;
			var tOF = true;
			var falseVal = 0;

			for (var i = 0; i < order.length; i++) {
				if (order[i].fulfilled === false) {
					falseVal ++;
				}
			}

			if (falseVal > 0) {
				tOF = false;
			}

			return tOF === false ? false : true;
		} catch (e) {

		}
	},
  hasShippingUser : function () {
    var user = Meteor.user();
    return _.isObject(user.profile.shippingUser);
  },
  shippingIntegrated : function () {
    var user = Meteor.user();
    return _.isString(user.profile.shippingUser.productionApiKey);
  },
  shipFromInfo : function () {
    try{
      var vendor = Vendors.findOne(this.order[0].vendorId);
      var shipsFrom = vendor.shipsFrom || {};

      return {
        street : shipsFrom.street,
        city : shipsFrom.city,
        zipcode : shipsFrom.zipcode,
        state : shipsFrom.state,
        country : shipsFrom.country
      }
    } catch (e) {};

    return {};
  }
});

/*****************************************************************************/
/* Fulfillment: Lifecycle Hooks */
/*****************************************************************************/
Template.Fulfillment.onCreated(function () {
});

Template.Fulfillment.onRendered(function () {
	//create styled select inputs
  $('#e1').select2({
    placeholder : 'Select A Carrier'
  });

  //wait for carrier to be parsed
  Meteor.setTimeout(function () {
    $('#e2').select2({
      placeholder : 'Select A template'
    })
  },100);
  $('#states').select2({placeholder : 'state'})
});

Template.Fulfillment.onDestroyed(function () {
	Session.set('selected:carrier');
	Session.set('shipment:rates');
  Session.set('selected:state')
});
