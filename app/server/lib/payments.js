PAYMENTS = (function () {
	
	function payments () {

		//the source of the data to map and reduce
		this.sourceDB = Transactions;

		this.changeUpFee = 0.015;
		this.stripeFee = 0.029;

		this.reducePayments = reducePayments.bind(this);

		//the date ranges for this year
		//(every 2 weeks for the entire year)
		this._weeks = getWeeks();

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

		for(var i = 0; i < weeks.length; i++) {
			var weeklyStatement = {};
			weeklyStatement.weeks = weeks[i];
			weeklyStatement.payout = 0;
			var range = moment().range(weeks[i]);

			for(var x = 0; x < payments.length; x++) {
				var payment = payments[x];
				if(range.contains(new Date(payment.timestamp))) {
					weeklyStatement.payout += ((parseFloat(payment.price) * payment.quantity) * (payment.percent/100)) + (Number(payment.shipping) || 0) ;
					payments.splice(x,1);
				}
			}

			if(weeklyStatement.payout > 0)  {
				weeklyStatement.payout = parseFloat(weeklyStatement.payout).toFixed(2);
				statements.push(weeklyStatement);
			}
		}
		return statements;
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


	function getRanges () {
		var startDate = moment().startOf('year');
		var endDate = moment().endOf('year');
		var ranges = [[startDate.format(), moment(startDate).add(7,'days').format()]];
		var range = moment.range(startDate, endDate);

		//get every two weeks of this year
		var week, lastweek = startDate, hasdate = true;
		for(var i = 0; i < 30; i++) {
			(function (w) {
				w = w.add(1, 'weeks');
				if(!range.contains(w)) {
					hasdate = false;	
				}
			})(lastweek);

			if(!hasdate) {
				break;
			} else {
				ranges.push([lastweek.format(), lastweek.add(1, 'weeks').format()])
				lastweek = lastweek.subtract(1, 'weeks');
			}
		}

		return ranges;
	}

	return payments;
})();


CHARITYPAYMENTS = (function (PAYMENTS) {

	function charityPayments () {
		PAYMENTS.call(this);

		this.destinationDB = CharityPayouts;
	}
	_.extend(charityPayments, PAYMENTS);


	/**
	* get the total amount of money that belongs to all the charities
	*
	* @return Array - an array containing gropus of charities
	* with their payments to allocate
	*/
	charityPayments.prototype._mapPayments = function () {
		var pipeline = [
			//only fetch transactions where the orders 
			//have been fulfilled and funds haven't 
			//been transfered
			{$match : {
				'order.fulfilled' : true,
			}},
			//we just need the order property
			{$project : {
				order : 1
			}},
			//break apart any multi demensional arrays
			{$unwind : '$order'},
			//group all the orders into one big array
			{$group : {
				_id : 1,
				item : {$push : '$order'}
			}},
			//group every payment with it's charity
			{$group : {
				_id : {charityId : '$item.charityId'}, //@todo - every item must now have a charityId
				payment : {$push : {percent : '$item.percentToCharity', price : '$item.price', product : '$item.productName'}}
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
	}
	_.extend(vendorPayments, PAYMENTS);


	/**
	* Get the weekly statements for a specific vendor
	*
	* @param String vendorId - the id of a vendor
	*/
	vendorPayments.prototype.getStatement = function (vendorId) {
		var mappedPayments = this._mapPayments();
		var vendorPayments;

		//find the vendor payments in the array
		var indx;
		for(var i =0; i < mappedPayments.length; i++) {
			if(mappedPayments[i]._id == vendorId) {
				indx = i;
				break;
			}
		}

		return this.reducePayments(mappedPayments[indx].payments);
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