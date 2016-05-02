SHIPPING = (function () {
	/*var easypost = Meteor.npmRequire('node-easypost')('XvaMUDfhoS0jPG28lkVIsQ');
	console.log('easy', easypost);*/

	function changeupShipping (user) {
		//the user should be linked to the vendor
		//that is doing the shipping
		this.user = user;

		if(!this.user || !this.user._id) {
			throw new Meteor.Error('no-user', 'you must provide a user object')
		}

		this.secretTestKey = 'XvaMUDfhoS0jPG28lkVIsQ';
		this.client = Meteor.npmRequire('node-easypost')(this.secretTestKey);
		this._parcelTemplates = PARCEL_TEMPLATES;
	}

	/**
	* create  a ship8
	*
	*/
	changeupShipping.prototype.createShipment = function (fromAddress, toAddress, parcel, callback) {
		this.client.Shipment.create({
			to_address : fromAddress,
			from_address : toAddress,
			parcel : parcel,
		}, function (err, shipment) {
			if(err) {
				console.error(err);
				return callback(new Meteor.Error('create-shipment', err));
			}

			callback(null, shipment);
		});
	};


 /**
	* create a parcel template
	* 
	* @deprecated
	* @param Object parcelObj - {wieght : 'ounzes', length : 'in', width : 'in', height : 'in'}
	* @param Function callback - function called after parcel is created
	*/
	changeupShipping.prototype.createParcel = function (parcelObj, callback) {

		//check that the parcel object has the
		//correct properties
		try{
			check(parcelObj, {
				weight : String,
				length : String,
				width : String,
				height : String,
			});
		} catch (e) {
			return callback(e);	
		}

		this.client.Parcel.create(parcelObj, Meteor.bindEnvironment(callback));
	};

	/**
	* get shipping rates for a package(parcel)
	*
	* @url - https://goshippo.com/docs/#shipments
	* 
	* @param String transactionId - the id of the transaction that we are shipping are order for
	* @param Object parcelInfo - {weight : 'oz', length : 'in', height :'in', width : 'in'}
	* @param Object shippingFrom - where the parcel is shipping from {street : '', city : '', zipcode : '', state : '', country : 'US'}
	*/
	changeupShipping.prototype.getShippingRates = function (transactionId, parcelInfo, shippingFrom, callback) {
		var self = this;
		var transaction = Transactions.findOne({_id : transactionId});

		try{
			//check if user provided a callback
			if(!_.isFunction(callback)) throw new Meteor.Error('no-callback', 'you must provide a callback');
			
			//check if the transaction this orderId is linked to actually exists
			if(!transaction) throw new Meteor.Error('get-transaction', 'this transaction does not exist');

			//check if user provided a parcel id
			if(!parcel_id) throw new Meteor.Error('no-parcel', 'you must provide a parcel id');

			//check if parcelinfo has been entered for the product
			if(!parcelInfo) throw new Meteor.Error('parcel-info', 'you have not entered any parcel info for this product');

			if(!shippingFrom) throw new Meteor.Error('shipping-from', 'you have not entered the "shipping from" info for this product');
		} catch (e) {
			return callback(e);
		}

		function create_from_address (callback) {
			self._createAddress({
				address : shippingFrom.street,
				city : shippingFrom.city,
				zipcode : shippingFrom.zipcode,
				state : shippingFrom.state,
				country : "US"
			}, self.user, callback);
		}

		function create_to_address (callback) {
			var buyer = Meteor.users.findOne({_id : transaction.userId});

			self._createAddress(transaction.shipping, buyer, callback)
		}

		function create_parcel (callback) {
			self.createParcel(parcelInfo, callback)
		}

		async.series({
			fromAddress : create_from_address,
			toAddress : create_to_address,
			parcel : create_parcel
		}, function (err, results) {
			if(err) {
				return callback(err);
			}

			self.createShipment(results.fromAddress, results.toAddress, results.parcel, function (err, result) {
				if(err) {
					return callback(err);
				}

				console.log('shipmentresult', result);

				callback(null, result.rates)
			});
		});
	}

	/**
	* creates and address using shippos api
	*
	* @description - the address object will be returned in the callback,
	* the only relevant information we will need for later requests in shippo's
	* api is the object_id that's returned upon a succesful request.
	*
	* @url - https://goshippo.com/docs/#address-create
	* 
	* @param Object addressObj - {address : 'the street', city : '', zipcode, state : '', country : ''}
	* @param Object user - a user object
	* @param Function callback - the callback whichi will contain either an error or an addressObj
	*/
	changeupShipping.prototype._createAddress = function (addressObj, user, callback) {
		try{
			if(!_.isObject(addressObj)) throw new Meteor.Error('no address object given');
			if(!_.isObject(user)) throw new Meteor.Error('no user given');
		} catch (e) {
			return callback(e);
		}

		var address = {
			name : user.profile.name,
			street1 : addressObj.address,
			city : addressObj.city,
			zip : addressObj.zipcode,
			state : addressObj.state,
			country : "US",
			//phone : ''
		};

		//create an adress
		this.client.Address.create(address, Meteor.bindEnvironment(function (err, address) {
			//verify the address
			address.verify(Meteor.bindEnvironment(function (err, response) {
				if(err) {
					console.error('address invalid', err);
					return callback(new Meteor.Error('address invalid'));
				} else if(response.message) {
					console.error('address is valid but has an error:', response.message);
					var verifiedAddress = response.address;
				} else {
					var verifiedAddress = response;
				}

				callback(null, verifiedAddress);
			}));
		}));
	};


	/**
	* Get the carrier account
	* @deprecated
	*
	*/
	changeupShipping.prototype._getCarrierObjectId = function (carrier, callback) {
		this.client.carrieraccount.list().then(Meteor.bindEnvironment(function (result) {
			var object_id;
			if(_.isArray(result.results)) {
				//loop through the carriers and find the correct carrier object
				var carrierObj = _.find(result.results, function (car) {
					return car.carrier == carrier;
				});

				if(!carrierObj) {
					return callback(new Meteor.Error('no-carrier', 'this carrier does not exist'));
				}

				//return the carrier object id
				callback(null, carrierObj.object_id)
			}
		}));
	};

	return changeupShipping;
})();