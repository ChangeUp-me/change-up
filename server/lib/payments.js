PAYMENTS = (function () {
	
	function payments () {

		//the source of the data to map and reduce
		this.sourceDB = Transactions;
		this.stripe = StripeAPI("sk_live_rNjG94LGyl52oDz7ZMTCSilq")

		this.changeUpFee = 0.015;
		this.stripeFee = 0.029;
		this.stripeTransactionFee = .30;

		this._reducePayments = reducePayments.bind(this);
		this._parseStatement = parseStatement.bind(this);
		this._findNextPayPeriod = findNextPayPeriod.bind(this);

		//the date ranges for this year
		this._ranges = getRanges();
		this._transferFunds = transferFunds;
	}


	/**
	* transfer the funds to a specific entity(vendor)
	* 
	* @access private
	*
	* @param String|Number amount - the amount to transfer to the bank account
	* @param String recipientId - the stripe recipientId
	* @param String bankId - the stripe bankId
	* @param String payPeriod - the payperiod for which this payment is for
	* @param Function callback - do something after the transfer has completed/failed
	*/
	function transferFunds (amount, recipientId, bankId, payPeriod, callback) {
		this.stripe.transfers.create({
			amount : dollarsToCents(amount),
			currency : 'usd',
			recipient : recipientId,
			bank_account : bankId,
			//card_id : 'cardId',
			statement_descriptor : 'payout for week ending :' + payPeriod
		}, Meteor.bindEnvironment(callback))
	}



	/**
	* Find the next pay period to make a payment
	*
	* @access private
	* @return Date - a date to schedule the next pay period
	*/
	function findNextPayPeriod () {
		var currentDate = Date.now();
		var dates = getRanges(2);
		var nextPayPeriod = null;

		for(var i = 0; i < dates.length; i++) {
			if(moment(currentDate).isBefore(dates[i][1])){
				nextPayPeriod = dates[i][1];
				break;
			}
		}

		return nextPayPeriod;
	}


	/**
	* Reduce all the payments mapped by each individual
	* entity(charity/vendor) into one array with weekly
	* statements
	*
	* @todo - remove dates that haven't happened yet
	* from ranges.
	*/
	function reducePayments (payments) {
		var weeks = this._ranges;
		var statements = [];
		var fee, profit, total, payment, range, weeklyStatement;

		for(var i = 0; i < weeks.length; i++) {
			weeklyStatement = {
				weeks  : weeks[i],
				charityDonation : 0,
				stripeFee : 0,
				vendorProfit : 0,
				processingFees : 0,
				changeUpFee : 0,
				transactions : [],
				total : 0
			};

			//get the range from the start
			//to the end of the week
			range = moment().range(weeks[i]);

			//loop through all the payments
			for(var x = 0; x < payments.length; x++) {
				payment = payments[x];
				//if the payment date is during this week
				//do some calculations
				if(range.contains(new Date(payment.timestamp))) {
					weeklyStatement = this._parseStatement(weeklyStatement, payment);
				}
			}

			//if there was a statement for this week
			if(weeklyStatement.vendorProfit > 0)  {
				weeklyStatement = formatStatement(weeklyStatement);
				statements.push(weeklyStatement);
			}
		}

		return statements;
	}

	function formatStatement (weeklyStatement) {
		return {
			weeks : weeklyStatement.weeks,
			stripeFee : parseFloat(weeklyStatement.stripeFee).toFixed(2),
			charityDonation : parseFloat(weeklyStatement.charityDonation).toFixed(2),
			vendorProfit : parseFloat(weeklyStatement.vendorProfit).toFixed(2),
			processingFees : parseFloat(weeklyStatement.processingFees).toFixed(2),
			changeUpFee : parseFloat(weeklyStatement.changeUpFee).toFixed(2),
			total : parseFloat(weeklyStatement.total).toFixed(2)
		}
	}

	/**
	* calculate the statement properties
	*
	* @param Object weeklyStatemnt - {see @param-statement}
	* @param Object payment - {price : '0', quantity : 0, shipping : '0', percent : 0 (charity percent), transactions : []}
	*
	* @return Object statement - {charityDonation : 0, stripeFee :0, vendorProfit : 0, processingFees :0, changeUpFee : 0, weeks : []}
	*/
	function parseStatement (weeklyStatement, payment) {
		var validProps = ['charityDonation', 'stripeFee', 'vendorProfit','processingFees', 'changeUpFee', 'total'];

		//convert all dates to strings so we can check if they are unique later
		for(var i = 0; i < Math.max(0, payment.transactions.length - 1); i++) {
			payment.transactions[i] = payment.transactions[i].toString();
		}
		//format shipping and payment total
		payment.shipping = Number(payment.shipping) || 0;
		payment.total = (Number(payment.price) * payment.quantity) + payment.shipping;

		//calculate the stripe fee
		payment.stripeFee = getStripeFee(payment, this.stripeFee, this.stripeTransactionFee);

		//calculate charity donation
		payment.charityDonation = (payment.total - payment.stripeFee - payment.shipping ) * (payment.percent /100);

		//calculate changeup fee 
		payment.changeUpFee = (payment.total - payment.stripeFee - payment.shipping ) * this.changeUpFee;

		//calculate the total fees 
		payment.fees = payment.charityDonation + payment.changeUpFee + payment.stripeFee;

		//calculate the vendor payout
		payment.vendorProfit = payment.total - payment.fees;

		//calculate processing fees
		payment.processingFees = payment.changeUpFee + payment.stripeFee;

		//keep only the properties we need
		payment = _.pick(payment, validProps);

		//format all values
		for(var prop in payment) {
			weeklyStatement[prop] += payment[prop];
		}

		return weeklyStatement;
	}

	function getStripeFee (payment, stripeFee, stripeTransactionFee) {
		var stripeFee;
		var stripeCents = 0;

		stripeFee = payment.total * stripeFee;

		//only charge a fee to unique transactions
		stripeCents = _.uniq(payment.transactions).length * stripeTransactionFee;

		stripeFee = stripeFee + stripeCents;

		return stripeFee;
	}


	/**
	* this gets the start and end date of each
	* week for the entire year
	*
	* @param Number multiple - only use this if you want to get
	* every X number of weeks instead of every 1 week. 
	*
	* @return Array [[weekStart, weekEnd]]
	*/
	function getRanges (multiple) {
		var weeksAmount = 1;
		var dayAmount = 7;

		if(_.isNumber(multiple)) {
			weeksAmount = weeksAmount * multiple;
			dayAmount = dayAmount * multiple;
		}

		var startDate = moment().startOf('year');
		var endDate = moment().endOf('year');
		var ranges = [[startDate.format(), moment(startDate).add(dayAmount,'days').format()]];
		var range = moment.range(startDate, endDate);

		//get every two weeks of this year
		var week, lastweek = startDate, hasdate = true;
		for(var i = 0; i < 50; i++) {

			//this is to keep the week object from
			//incrementing while we check if
			//the current week is outside of this year
			(function (w) {
				w = w.add(1, 'weeks');
				if(!range.contains(w)) {
					hasdate = false;	
				}
			})(lastweek);

			//if the week is not during this year
			if(!hasdate) {
				break;
			} else {
				//store the week range
				//@note- weeks range from start of the week to the end of the week
				ranges.push([lastweek.format(), lastweek.add(weeksAmount, 'weeks').format()])
				lastweek = lastweek.subtract(1, 'weeks');
			}
		}

		return ranges;
	}

	/**
	* get every week of the year
	*/
	function getWeeks () {
		var startWeek = moment().startOf('year');
		var endWeek = moment().endOf('year');
		var difference = endWeek.diff(startWeek, 'weeks');
		var weeks = [startWeek.format()];

		var k;
		for(var i =0; i < difference; i++) {
			k = startWeek.add(1, 'week');
			weeks.push(k.format());
		}	

		return weeks;
	}


	function dollarsToCents (price) {
		price = parseFloat(price).toFixed(2)
		var sides = price.split('.');

		var cents = 100 * parseInt(sides[0]);
		cents = cents + parseInt(sides[1]);

		return cents;
	}

	return payments;
})();


CHARITYPAYMENTS = (function (PAYMENTS) {

	function charityPayments () {
		PAYMENTS.call(this);

		this.destinationDB = CharityPayouts;
		this._mappedPayments = this._mapPayments();


		//console.log('mapped', JSON.stringify(this._mappedPayments));
	}
	_.extend(charityPayments, PAYMENTS);

	
	/**
	* Get the weekly statements for a specific charity
	*
	* @param String charityId - the id of a charity
	*/
	charityPayments.prototype.getStatement = function (charityId) {
		var mappedPayments = this._mappedPayments;

		//find the charity payments in the array
		var indx;
		for(var i =0; i < mappedPayments.length; i++) {
			if(mappedPayments[i]._id == charityId) {
				indx = i;
				break;
			}
		}

		if(mappedPayments[indx]) {
			var statements = this._reducePayments(mappedPayments[indx].payments);

			//only return the charity donations and the weeks or it
			return _.map(statements, function (statement) {
				return _.pick(statement, ['charityDonation', 'weeks'])
			})
		}
		return [];
	};


	/**
	* Save the weekly statements for a specific charity
	*
	* @param String charityId
	* @param Array statements - [weeklyStatementObject]
	* @param String charityName - the name of the charity
	*/
	charityPayments.prototype.saveStatements = function (charityId, statements, charityName) {
		var self = this;
		_.each(statements, function (statement) {

			if(statement) {
				statement = {
					charityId : charityId,
					charityName : charityName,
					charityDonation : statement.charityDonation,
					weekStart : statement.weeks[0],
					weekEnd : statement.weeks[1]
				}

				//if record exists update it
				//otherwise create a new one
				self.destinationDB.upsert({
					charityId : charityId,
					weekEnd : new Date(statement.weekEnd)
				},{
					$set : statement
				})
			}
		})
	};


	/**
	* get the total amount of money that belongs to all the charities
	* 116 40.56 171 = 327.56
	* @return Array - an array containing gropus of charities
	* with their payments to allocate
	*
	* @todo - every transaction in stripe takes 30 cents
	*/
	charityPayments.prototype._mapPayments = function () {
		var pipeline = [
			//only fetch transactions where the orders 
			//have been fulfilled
			{$match : {
				'order.fulfilled' : true,
			}},
			//we just need the order and timestamp property
			{$project : {
				timestamp : 1,
				order : 1
			}},
			//only leave one element in each order array
			{$unwind : '$order'},
			{$group : {
				_id : {orderId : '$order.orderId', charityId : '$order.charityId', timestamp : '$timestamp', productId : '$order.productId'},
				price : {$first : '$order.price'},
				percent : {$first : '$order.percentToCharity'},
				quantity : {$sum : '$order.quantity'},
				transactions : {$addToSet : '$timestamp'},
				shipping : {$first : '$order.shippingPrice'}
			}},
			{$sort : {'_id.timestamp' : 1}},
			//group every payment with it's charity
			{$group : {
				_id : '$_id.charityId', //@todo - every item must now have a charityId
				payments : {
					$push : {
						shipping : '$shipping',
						timestamp : '$_id.timestamp',
						percent : '$percent', 
						price : '$price', 
						quantity : '$quantity',
						transactions : '$transactions'
					}
				}
			}}
		];
		return this.sourceDB.aggregate(pipeline);
	};

	return charityPayments;
})(PAYMENTS);

VENDORPAYMENTS = (function (PAYMENTS) {

	function vendorPayments () {
		PAYMENTS.call(this);

		this.destinationDB = VendorPayouts;
		this._mappedPayments = this._mapPayments();

		//console.log('mapped', JSON.stringify(this._mappedPayments));
	}
	_.extend(vendorPayments, PAYMENTS);



	/**
	* this will set a timer that will fire a payout function
	* on a certain date/payperiod 
	*
	* @access public
	*
	* @param Date scheduleTime - the time we want to schedule
	* the next payouts
	*
	*/
	vendorPayments.prototype.scheduleTransfer = function() {
		var self = this;
		var payPeriod  = self._findNextPayPeriod();
		var payOn = new Date(payPeriod).getTime();
		var now = Date.now();
		var time = Math.max(0, payOn - now);

		console.log('scheduling transfer on :', payPeriod);
		console.log('which is in : ' + time + ' milliseconds');

		Meteor.setTimeout(function () {
			//get the payouts for the vendor that
			//are on or below the scheduled date
			//and haven't been distributed yet
			var payouts = self.destinationDB.find({
				$and : [
					{paidToVendor : {$ne : true}},
					{weekEnd : {$lte : new Date(moment(payPeriod).format())}}
				]
			}).fetch();

			var onTransfer;
			//loop through each payout and attempt to 
			//transfer funds to that vendor
			_.each(payouts, function (pay) {
				var vendor = Vendors.findOne({_id : pay.vendorId});

				//check if they've setup a stripe account
				if(!_.isObject(vendor.stripe)) {
					return console.error('the vendor ' + vendor.storeName + ' does not have a stripe account setup');
				}

				//after we transfer the funds
				onTransfer = function (err, transfer) {
					if(err){
						return console.error('transfer-error', err);
					}

					console.log('transfer complete for vendor : ' + vendor.storeName, transfer);

					//record that we've made this payout
					self.destinationDB.update({_id : pay._id}, {$set : {paidToVendor : true}})
				};

				//attempt to transfer the funds
				try{
					self._transferFunds(
						pay.vendorProfit, 
						vendor.stripe.recipient, 
						vendor.stripe.bank_account, 
						moment(payPeriod).format(), 
						onTransfer
					);
				} catch (e) {
					console.error('payout-error to: ' +vendor.storeName , e.stack);
				}
			})

			console.log(payouts);
		}, time);
	};


	/**
	* Get the weekly statements for a specific vendor
	*
	* @param String vendorId - the id of a vendor
	*/
	vendorPayments.prototype.getStatement = function (vendorId) {
		var mappedPayments = this._mappedPayments;

		//find the vendor payments in the array
		var indx;
		for(var i =0; i < mappedPayments.length; i++) {
			if(mappedPayments[i]._id == vendorId) {
				indx = i;
				break;
			}
		}

		if(mappedPayments[indx]) {
			return this._reducePayments(mappedPayments[indx].payments);
		}
		return [];
	};


	/**
	* Save the weekly statements for a specific vendor
	*
	* @param String vendorId
	* @param Array statements - [weeklyStatementObject]
	* @param String vendorName - the name of the vendor
	*/
	vendorPayments.prototype.saveStatements = function (vendorId, statements, vendorName) {
		var self = this;
		_.each(statements, function (statement) {
			statement = {
				vendorId : vendorId,
				vendorName : vendorName,
				charityDonation : statement.charityDonation,
				processingFees : statement.processingFees,
				stripeFee : statement.stripeFee,
				changeUpFee : statement.changeUpFee,
				vendorProfit : statement.vendorProfit,
				weekStart : statement.weeks[0],
				weekEnd : statement.weeks[1],
			};


			self.destinationDB.upsert({
				vendorId : vendorPayments,
				weekEnd : new Date(statement.weekEnd)
			},{
				$set : statement
			})
		})
	};


	/**
	* get the total amount of money that belongs to all the vendors
	*
	* @return Array - an array containing groups of vendor objects
	* with their payments to allocate
	*/
	vendorPayments.prototype._mapPayments = function () {
		var percent =  100 - (this.changeUpFee*100) - (this.stripeFee*100);
		var pipeline = [
			{$match : {
				'order.fulfilled' : true,
			}},
			{$project : {
				order : 1,
				timestamp : 1
			}},
			{$unwind : '$order'},
			//group every individual order
			{$group : {
				_id : {orderId : '$order.orderId', vendorId : '$order.vendorId', productId : '$order.productId', timestamp : '$timestamp'},
				price : {$first : '$order.price'},
				shipping : {$first : '$order.shippingPrice'},
				//@todo - get quantity
				//calclualte the percent minus changeup fee and stripe fee
				//percent : {$first : {$subtract : [percent, '$order.percentToCharity'] }},
				percent : {$first : '$order.percentToCharity'},
				quantity : {$sum : '$order.quantity'},
				transactions : {$addToSet :  '$timestamp'}
			}},
			{$sort : {'_id.timestamp' : 1}},
			{$group : {
				_id : '$_id.vendorId',
				payments : {
					$push : {
						timestamp : '$_id.timestamp',
						shipping : '$shipping',
						productId : '$_id.productId',
						price : '$price',
						percent : '$percent',
						quantity : '$quantity',
						transactions : '$transactions'
					}
				},
			}}
		];
		return this.sourceDB.aggregate(pipeline);
	};

	return vendorPayments;
})(PAYMENTS)