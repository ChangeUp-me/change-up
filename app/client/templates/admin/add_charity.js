(function () {

	Template.AddCharity.events({
		"click li.charity > button" : function (event) {	

			//if the user already created a vendor
			//than add the new charity to the venor document
			if(Meteor.user().profile.vendorId) {
				addCharityToVendor(this._id);
			} 
			//otherwise just add it to the session
			else {
				addCharityToSession.bind(this)();
			}

			Router.go('vendorProfile');
		}
	});

	Template.AddCharity.helpers({
		charities : function () {
			return Charities.find().fetch()
		}
	});


  /**
	* check if a  charity has already been added to an array
	*
	* @param {Array} arr [{name : 'charityname', id : 'charityid'}]
	* @param {String} id - 'charity_id_to_check_for'
	*/
	function charitySelected (arr, id) {
		return arr.findIndex(function (charity, index) {
			return charity.id == id;
		})
	}

	/**
	* Add a charity name and id to a users session
	*
	* @note - "this" should be bound to the context of
	* the charity that was clicked
	*/
	function addCharityToSession () {
		var selectedCharities = Session.get('selectedCharities');

		selectedCharities = selectedCharities || [];

		//check if the newley selected charity is already in the session
		if(charitySelected(selectedCharities, this._id) == -1){
			selectedCharities.push({id : this._id, name : this.name});
		}

		Session.set('selectedCharities', selectedCharities);
	}

	/**
	* Add a charity to the users vendor document
	*
	* @param {String} id - 'acharityid';
	*/
	function addCharityToVendor (id) {
		Meteor.call('addVendorCharity', id, function (err) {
			if(err) {
				console.error(err);
				return sAlert.error(err);
			}
		})
	}
})();
