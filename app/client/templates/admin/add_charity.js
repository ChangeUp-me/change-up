(function () {

	function charity_selected (arr, id) {
		return arr.findIndex(function (charity, index) {
			return charity.id == id;
		})
	}

	Template.AddCharity.events({
		"click li.charity > button" : function (event) {
			var selectedCharities = Session.get('selectedCharities');

			selectedCharities = selectedCharities || [];

			if(charity_selected(selectedCharities, this._id) == -1){
				selectedCharities.push({id : this._id, name : this.name});
			}

			Session.set('selectedCharities', selectedCharities);

			console.log(Session.get('selectedCharities'));
			Router.go('vendorProfile');
		}
	});

	Template.AddCharity.helpers({
		charities : function () {
			return Charities.find().fetch()
		}
	});
})();
