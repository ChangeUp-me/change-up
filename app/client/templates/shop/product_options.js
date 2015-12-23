(function () {
	/*****************************************************************************/
	/* ProductOptions: Event Handlers */
	/*****************************************************************************/

	Template.ProductOptions.events({
		'click .size.select' : function (event) {
			var sizes = this.sizes;
			var element = $(event.target).closest('.product-options').find('.sd-items');
			var inputVal = $(event.target).closest('.product-options').find('input[name="size"]').val();

			if(!sizes) return;

			buildItems(element, 'size', sizes, inputVal);
		},
		'click .quantity.select' : function (event) {
			var quantities = [1,2,3,4,5,6];
			var element = $(event.target).closest('.product-options').find('.sd-items');
			var inputVal = $(event.target).closest('.product-options').find('input[name="quantity"]').val();

			buildItems(element, 'quantity', quantities, inputVal);
		},
		'click li[data-quantity]' : function (event) {
			selectOption($(event.target), 'quantity');
		},
		'click li[data-size]' : function (event) {
			selectOption($(event.target), 'size');
		},

	});

	/*****************************************************************************/
	/* ProductOptions: Helpers */
	/*****************************************************************************/
	Template.ProductOptions.helpers({

	});

	/*****************************************************************************/
	/* ProductOptions: Lifecycle Hooks */
	/*****************************************************************************/
	Template.ProductOptions.onCreated(function () {
	});

	Template.ProductOptions.onRendered(function () {
		$(document).on('click', closeDropdown)
	});

	Template.ProductOptions.onDestroyed(function () {
		$(document).off('click', closeDropdown);
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

