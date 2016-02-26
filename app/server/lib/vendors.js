makePurchase = function (cart) {
  var totalCost = 0;
  var vendorPayout = [];
  var charityPayout = []
  var weekStart = getStartOfWeek();
  var weekEnd = getEndOfWeek();


  // Calculate Vendor Payout
  for (var i = 0; i < cart.length; i++) {
    var existingVendor = -1;

    // check if vendor is already in vendorPayout array
    for (var x = 0; x < vendorPayout.length; x++) {
      if (vendorPayout[x].vendorId === cart[i].vendorId) {
        existingVendor = x;
      }
    }

    // if vendor isnt in transaction info put him there
    if (existingVendor === -1) {
      vendorPayout.push({
        'vendorId' : cart[i].vendorId,
        'vendorName' : Vendors.findOne({_id: cart[i].vendorId}).storeName,
        'vendorShipping' : Vendors.findOne({_id: cart[i].vendorId}).shippingPrice,
        'vendorProfit' : roundToTwo(cart[i].price) - roundToTwo(cart[i].price*(0.03)) - roundToTwo(cart[i].price*(0.02)) - roundToTwo((cart[i].price/100)*(Products.findOne({_id: cart[i].productId}).percentToCharity)),
        'stripeFee' : roundToTwo(cart[i].price*(0.03)),
        'changeUpFee' : roundToTwo(cart[i].price*(0.02)),
        'charityDonation' : roundToTwo((cart[i].price/100)*(Products.findOne({_id: cart[i].productId}).percentToCharity)),
        'weekStart' : weekStart,
        'weekEnd' : weekEnd
      });
    } else {
      // if vendor is in transaction info update what they've sold
      vendorPayout[existingVendor].vendorProfit += roundToTwo(roundToTwo(cart[i].price) - roundToTwo(cart[i].price*(0.03)) - roundToTwo(cart[i].price*(0.02)) - roundToTwo((cart[i].price/100)*(Products.findOne({_id: cart[i].productId}).percentToCharity)));
      vendorPayout[existingVendor].stripeFee += roundToTwo(cart[i].price*(0.03));
      vendorPayout[existingVendor].changeUpFee += roundToTwo(cart[i].price*(0.02));
      vendorPayout[existingVendor].charityDonation += roundToTwo((cart[i].price/100)*(Products.findOne({_id: cart[i].productId}).percentToCharity));
    }

  }

  // Calculate Charity Payout
  for (var i = 0; i < cart.length; i++) {
    var existingCharity = -1;

    // check if vendor is already in vendorPayout array
    for (var x = 0; x < charityPayout.length; x++) {
      if (charityPayout[x].charityId === cart[i].charityId) {
        existingCharity = x;
      }
    }

    // if vendor isnt in transaction info put him there
    if (existingCharity === -1) {
      charityPayout.push({
        'charityId' : cart[i].charityId,
        'charityName' : Charities.findOne({_id : cart[i].charityId}).name,
        'charityDonation' : roundToTwo((cart[i].price/100)*(Products.findOne({_id: cart[i].productId}).percentToCharity)),
        'weekStart' : weekStart,
        'weekEnd' : weekEnd
      });
    } else {
      // if vendor is in transaction info update what they've sold
      charityPayout[existingVendor].charityDonation += roundToTwo((cart[i].price/100)*(Products.findOne({_id: cart[i].productId}).percentToCharity));
    }

  }

  // Insert or update vendors weekly transaction report
  for (var i = 0; i < vendorPayout.length; i++) {
    if (VendorPayouts.findOne({ $and: [{vendorId : vendorPayout[i].vendorId}, {weekEnd : vendorPayout[i].weekEnd}]})) {
      var exists = VendorPayouts.findOne({ $and: [{vendorId : vendorPayout[i].vendorId}, {weekEnd : vendorPayout[i].weekEnd}]});
      exists.vendorShipping = (roundToTwo(parseFloat(exists.vendorShipping) + parseFloat(vendorPayout[i].vendorShipping))).toString();
      exists.vendorProfit = (roundToTwo(parseFloat(exists.vendorProfit) + parseFloat(vendorPayout[i].vendorProfit))).toString();
      exists.stripeFee = (roundToTwo(parseFloat(exists.stripeFee) + parseFloat(vendorPayout[i].stripeFee))).toString();
      exists.changeUpFee = (roundToTwo(parseFloat(exists.changeUpFee) + parseFloat(vendorPayout[i].changeUpFee))).toString();
      exists.charityDonation = (roundToTwo(parseFloat(exists.charityDonation) + parseFloat(vendorPayout[i].charityDonation))).toString();
      VendorPayouts.update({
        $and: [
          {
            vendorId : vendorPayout[i].vendorId
          }, {
            weekEnd : vendorPayout[i].weekEnd
          }
        ]
      }, {
        $set: {
          'vendorShipping': exists.vendorShipping,
          'vendorProfit': exists.vendorProfit,
          'stripeFee': exists.stripeFee,
          'changeUpFee': exists.changeUpFee,
          'charityDonation': exists.charityDonation
        }
      });
    } else {
      VendorPayouts.insert(vendorPayout[i]);
    }

  }

  // Insert or update charity weekly transaction report
  for (var i = 0; i < charityPayout.length; i++) {
    if (CharityPayouts.findOne({ $and: [{charityId : charityPayout[i].charityId}, {weekEnd : charityPayout[i].weekEnd}]})) {
      var exists = CharityPayouts.findOne({ $and: [{charityId : charityPayout[i].charityId}, {weekEnd : charityPayout[i].weekEnd}]});
      exists.charityDonation = (roundToTwo(parseFloat(exists.charityDonation) + parseFloat(charityPayout[i].charityDonation))).toString();
      CharityPayouts.update({
        $and: [
          {
            charityId : charityPayout[i].charityId
          }, {
            weekEnd : charityPayout[i].weekEnd
          }
        ]
      }, {
        $set: {
          'charityDonation': exists.charityDonation
        }
      });
    } else {
      CharityPayouts.insert(charityPayout[i]);
    }

  }
}

// Calculate Date For Payout

getStartOfWeek = function () {
  var next = new Date();
  next.setDate( next.getDate() - next.getDay() );
  next = ((next.getUTCMonth()+1)+"/"+next.getUTCDate()+"/"+next.getUTCFullYear()+" 00:00:00 EST");
  next = new Date(next);
  return next;
}

getEndOfWeek = function () {
  var next = new Date();
  next.setDate( next.getDate() - next.getDay() + 6 );
  next = ((next.getUTCMonth()+1)+"/"+next.getUTCDate()+"/"+next.getUTCFullYear()+" 23:59:59 EST");
  next = new Date(next);
  return next;
}

roundToTwo = function (num) {
  return +(Math.round(num + "e+2")  + "e-2");
}
