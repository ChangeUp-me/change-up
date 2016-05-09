SHIPPING = (function () {
	function changeupShipping (user, apiTestKey) {
		//the user should be linked to the vendor
		//that is doing the shipping
		this.user = user;

		if(!this.user || !this.user._id) {
			throw new Meteor.Error('no-user', 'you must provide a user object')
		}

		this.baseUrl = 'https://api.easypost.com/v2/';

		this.secretTestKey = apiTestKey || 'XvaMUDfhoS0jPG28lkVIsQ';
		this.client = Meteor.npmRequire('node-easypost')(this.secretTestKey);
		this._parcelTemplates = PARCEL_TEMPLATES;
	}


	/**
	* purchases a label and returns the pdf file
	*
	* @param Object rate - the rate the user wants to purchase
	* {id : 'rate_**', object : Rate, ...}
	* @param Object shipmentId - the id of the shipment
	*/
	changeupShipping.prototype.purchaseLabel = function (shipmentId, rate, callback) {
		this.client.Shipment.retrieve(shipmentId, Meteor.bindEnvironment(function (err, shipment) {
			if(err) return callback(new Meteor.Error('purchase-shipment', err));

			shipment.buy({rate : rate}, Meteor.bindEnvironment(function (err, shipment) {
				if(err) {
					return callback(new Meteor.Error('purchase-shipment', err));
				}

				callback(null, shipment);
			}));
		}));
	};	


	/**
	* create  a shipment
	*
	* @param Object fromAddress - where the package is shipping from
	* @param Object toAddress - where the package is shipping to
	* @param Object parcel - the package info 
	* @param Function callback - a callback function where the shipment object will be returned
	* {id : 'shp_***', ...}
	*/
	changeupShipping.prototype.createShipment = function (fromAddress, toAddress, parcel, callback) {
		this.client.Shipment.create({
			to_address : toAddress,
			from_address : fromAddress,
			parcel : parcel,
		}, Meteor.bindEnvironment(function (err, shipment) {
			if(err) {
				console.error(err);
				return callback(new Meteor.Error('create-shipment', err));
			}

			callback(null, shipment);
		}));
	};

	/**
	* creates a new easypost account for the vendor
	*
	* 
	* @param Object accountObj - {name  : '', email : '', password : '', password_confirmation : '', phone_number :''};
	* @param Function Callback - a callback object that will return the new user
	*/
	changeupShipping.prototype.createAccount = function (accountObj, callback) {
		HTTP.call('POST', this.baseUrl + 'users', {
			data : {
				user : accountObj
			}
		}, function (err, result) {
			if(err) {
				return callback(new Meteor.Error('create-user', getApiErrorMessage(err)));
			}

			callback(null, result.data);
		});
	};


	/**
	* get the api keys for a shipping account.  you'll use these api 
	* keys to make further calls
	*
	* @param String accountId - the id of the account we need api keys for
	* @param Function Callback - the callback where the apikeys will be returned to
	* {id : 'user_**', keys : [{key : 'dsa**',...}] ...}
	*/
	changeupShipping.prototype.getAccountApiKeys = function (callback) {
		HTTP.call('GET', this.baseUrl + 'api_keys', {
			auth : this.secretTestKey + ':',
		}, function (err, result) {
			result = result.data;
			if(err) {
				return callback(new Meteor.Error('account-api-keys', getApiErrorMessage(err)));
			}

			callback(null, result.keys);
		});
	};


	/**
	* Get all the carriers and there auth schemas(what data we need to POST in order
	* to authenticate a carrier account)
	* 
	* @param Function callback - callback function where the carrier accounts and schemas
	* will be returend to [{type : 'aramexAccount', fields {credentials : {username : ''}}}] 
	*/
	changeupShipping.prototype.getCarrierTypes = function (callback) {
		HTTP.call('GET', this.baseUrl + 'carrier_types', {
			auth : this.secretTestKey + ':',
		}, function (err, result) {
			if(err) {
				return callback(new Meteor.Error('get-carriers', getApiErrorMessage(err)));
			}

			callback(null, result);
		})
	};


	/**
	* create a carrier account
	*
	* @param Object credentials - an object containing credentials needed to authorize
	* the carrier account
	* @param Function callback - callback function where the carrier account will be returned to
	*/
	changeupShipping.prototype.createCarrierAccount = function (carrier, reference, credentials) {
		HTTP.call('POST', this.baseUrl + 'carrier_accounts', {
			auth : this.secretTestKey + ':',
			data : {
				type : carrier,
				description : '',
				reference : reference,
				credentials : credentials
			}
		}, function (err, account) {
			if(err) {
				return callback(new Meteor.Error('create-carrier', getApiErrorMessage(err)));
			}

			callback(null, account);
		});
	}


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

				callback(null, result)
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
					var verifiedAddress = response.address;
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

 /**
	* get the api keys for a child (vendor).  you'll use these api 
	* keys to make further calls
	*
	* @param String childId - the id of the child we need api keys for
	* @param Function Callback - the callback where the apikeys will be returned to
	* {id : 'user_**', keys : [{key : 'dsa**',...}] ...}
	*/
	changeupShipping.prototype.getChildApiKeys = function (childId, callback) {
		try{
			check(childId, String)
		} catch (e) {
			return callback(e);
		}

		HTTP.call('GET', this.baseUrl + 'api_keys', {
			auth : this.secretTestKey + ':',
		}, function (err, result) {
			result = result.data;
			if(err) {
				return callback(new Meteor.Error('child-api-keys', getApiErrorMessage(err)));
			}

			//find the apikeys for this child
			var keys = _.find(result.children, function (child) {
				return child.id == childId;
			})

			callback(null, keys.keys);
		});
	}


	/**
	* Create a child user, so that a vendor can input their own
	* carrier accounts and such.
	*
	*
	* @param Function callback - callback function returns a user object in the result
	* {id : 'user_**', ...}
	*/
	changeupShipping.prototype.createChild = function (callback) {
		HTTP.call('POST', this.baseUrl + 'users', {
			auth : this.secretTestKey + ':',
			data : {
				name : this.user.profile.name
			}
		}, function (err, result) {
			if(err) {
				return callback(new Meteor.Error('create-child-user', getApiErrorMessage(err)));
			}

			callback(null, result.data);
		});
	};

	/**
	* Parse the error message from the easypost
	* api
	*
	*/
	function getApiErrorMessage (error) {
		var errorMessage;

		try{
			_.each(error.response.data.error.errors, function (err) {
				errorMessage += " " + err.message + ",";
			})
		} catch (e) {console.error('error-getting-error', e)}

		return errorMessage;
	}


	return changeupShipping;
})();