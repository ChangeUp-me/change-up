PAYMENTS = (function () {
	
	function payments () {

		//the source of the data to map and reduce
		this.sourceDB = Transactions;

		this.changeUpFee = 0.015;
		this.stripeFee = 0.029;

		this._reducePayments = reducePayments.bind(this);
		this._parseFinalStatement = parseFinalStatement.bind(this);

		//the date ranges for this year
		this._ranges = getRanges();
	}

	/**
	* Reduce all the payments mapped by each individual
	* child(charity/vendor) into one array with weekly
	* statements
	*/
	function reducePayments (payments) {
		var weeks = this._ranges;
		var statements = [];
		var fee, profit, total, payment, range, weeklyStatement;

		for(var i = 0; i < weeks.length; i++) {
			weeklyStatement = {
				weeks  : weeks[i],
				payout : 0,
				total : 0,
				fees : 0
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
					total = (Number(payment.price) * payment.quantity) + (Number(payment.shipping) || 0);
					fees = total * (payment.percent/100);
					profit = total - fees;

					//reduce all transactions for the week
					//to one total
					weeklyStatement.total +=  total;
					weeklyStatement.payout += profit;
					weeklyStatement.fees += fees;
				}
			}

			//if there was a statement for this week
			if(weeklyStatement.payout > 0)  {
				weeklyStatement = this._parseFinalStatement(weeklyStatement);

				statements.push(weeklyStatement);
			}
		}
		return statements;
	}


	function getRanges () {
		var startDate = moment().startOf('year');
		var endDate = moment().endOf('year');
		var ranges = [[startDate.format(), moment(startDate).add(7,'days').format()]];
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
				ranges.push([lastweek.format(), lastweek.add(1, 'weeks').format()])
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

	function parseFinalStatement (weeklyStatement) {
		weeklyStatement.processingFee = weeklyStatement.fees * (this.changeUpFee + this.stripeFee);
		weeklyStatement.charityDonations = parseFloat(weeklyStatement.fees - weeklyStatement.processingFee).toFixed(2);
		weeklyStatement.payout = parseFloat(weeklyStatement.payout).toFixed(2);
		weeklyStatement.total = parseFloat(weeklyStatement.total).toFixed(2);
		weeklyStatement.fees = parseFloat(weeklyStatement.fees).toFixed(2);
		weeklyStatement.processingFee = parseFloat(weeklyStatement.processingFee).toFixed(2);
		return weeklyStatement;
	}

	return payments;
})();


CHARITYPAYMENTS = (function (PAYMENTS) {

	function charityPayments () {
		PAYMENTS.call(this);

		this.destinationDB = CharityPayouts;
		this._mappedPayments = this._mapPayments();
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
				return _.pick(statement, ['charityDonations', 'weeks'])
			})
		}
		return [];
	};


	/**
	* Save the weekly statements for a specific charity
	*
	* @param String charityId
	* @param Array statements - [weeklyStatementObject]
	*/
	charityPayments.prototype.saveStatements = function (charityId, statements) {
		var self = this;
		_.each(statements, function (statement) {

			if(statement) {
				statement = {
					charityId : charityId,
					charityDonation : statement.charityDonations,
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
	*
	* @return Array - an array containing gropus of charities
	* with their payments to allocate
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
				percent : {$sum : '$order.percentToCharity'},
				quantity : {$sum : '$order.quantity'}
			}},
			{$sort : {'_id.timestamp' : 1}},
			//group every payment with it's charity
			{$group : {
				_id : '$_id.charityId', //@todo - every item must now have a charityId
				payments : {
					$push : {
						timestamp : '$_id.timestamp',
						percent : '$percent', 
						price : '$price', 
						quantity : '$quantity'
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

	}
	_.extend(vendorPayments, PAYMENTS);


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
	*/
	vendorPayments.prototype.saveStatements = function (vendorId, statements) {
		var self = this;
		_.each(statements, function (statement) {
			statement = {
				vendorId : vendorId,
				charityDonation : statement.charityDonations,
				processingFees : statement.processingFee,
				vendorProfit : statement.payout,
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
				percent : {$sum : {$subtract : [percent, '$order.percentToCharity'] }},
				quantity : {$sum : '$order.quantity'}
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
						quantity : '$quantity'
					}
				}
			}}
		];
		return this.sourceDB.aggregate(pipeline);
	};

	return vendorPayments;
})(PAYMENTS)