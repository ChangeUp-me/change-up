(function () {
	/*****************************************************************************/
	/* ProductOptions: Event Handlers */
	/*****************************************************************************/

	Template.ProductOptions.events({
		"click .size-select li" : function (event, template) {
			var allSizes= [];
			for (var i = 0; i < template.data.sizes.length; i++) {
				allSizes.push(template.data._id+""+template.data.sizes[i])
			}
			$('#' + allSizes.join(',#')).removeClass('selected');
			$('#' + allSizes.join(',#')).data('value', '');
			$(event.target).toggleClass('selected');
			$(event.target).data('value', 'selected');
		}

	});

	/*****************************************************************************/
	/* ProductOptions: Helpers */
	/*****************************************************************************/
	Template.ProductOptions.helpers({
		charities: function(){
			var charitiesId = Vendors.findOne({'_id':(this.vendorId)}).charities;
			var charitiesObj = Charities.find({_id:{ $in: charitiesId}}).fetch();
			var charities= [];
			for (var i = 0; i < charitiesObj.length; i++) {
				charities.push({"id":charitiesObj[i]._id, "name": charitiesObj[i].name});
			}
			return charities;
		},
		sizes: function(){
			return this.sizes;
		}

	});

	/*****************************************************************************/
	/* ProductOptions: Lifecycle Hooks */
	/*****************************************************************************/
	Template.ProductOptions.onCreated(function () {
	});

	Template.ProductOptions.onRendered(function () {

	});

	Template.ProductOptions.onDestroyed(function () {

	});


	/**
	* close dropdown lists when a user clicks away from it,
	* or selects an option
	*
	* @param {Object} event
	*/
	function closeDropdown (event) {
		if(!$(event.target).closest('.product-option').length) {
			if($('.sd-items').is(":visible")) {
				$('.sd-items').removeClass('open');
			}
		}
	}

	/**
	* add items to the product options dropdown lists
	*
	* @param {domObject} element - the element (ul) that you want to append the items to
	* @param {String} attrName - the type of option that these items belong to ex : (quantity, size)
	* @param {Array} items - a list of items ot append to the element ['itemone', 'itemtwo']
	* @param {String|Number} inputVal - the current value of the input form element
	*/
	function buildItems (element, attrName, items, inputVal) {
		element.empty();
		var ele;

		items.forEach(function (val, indx) {
			ele = $('<li data-'+attrName+'="'+val+'" class="sd-item">'+ val +'</li>').appendTo(element);

			if(val.toString().toLowerCase() == inputVal.toString().toLowerCase()) {
				selectOption(ele, attrName);
			}
		});

		element.toggleClass('open');
	}

	/**
	* selects an option from the dropdown list
	*
	* @param {domObject} element - the element (li) that the user selected
	* @param {String} name - the type of option that the selected item is ex: (quantity, size)
	*/
	function selectOption (element, name) {
		var input = element.closest('.product-options').find('input[name="'+name+'"]');

		element.parent().children().removeClass('selected');
		element.addClass('selected');

		input.val(element.attr('data-'+name+'').toString().toLowerCase());

		//element.parent().removeClass('open');
	}
})();
