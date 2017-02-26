// single state object

var state = {
	items: []
};

var itemTemplate = (
  '<li>' +
    '<span class="shopping-item js-shopping-item"></span>' +
    '<div class="shopping-item-controls">' +
      '<button class="js-shopping-item-toggle">' +
        '<span class="button-label">check</span>' +
      '</button>' +
      '<button class="js-shopping-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);


// state modification: adding item into the `items` array

var addItem = function(state, item) {
	state.items.push({
		itemName: item,
		checkedOff: false
	});
};


// state modification: get items on the list

var getItem = function(state, itemIndex) {
	return state.items[itemIndex];
};


// state modification: delete items from the list

var deleteItem = function(state, itemIndex) {
	state.items.splice(itemIndex, 1);
};


// state modification: update item

var updateItem = function(state, itemIndex, newItem) {
	state.items[itemIndex] = newItem;
};


// render item and list

var renderItem = function(item, itemId, itemTemplate, itemDataAttr) {
	var element = $(itemTemplate);
	element.find('.js-shopping-item').text(item.itemName);

	if (item.checkedOff) {
		element.find('.js-shopping-item').addClass('shopping-item__checked');
	}
	element.find('.js-shopping-item-toggle');
	element.attr(itemDataAttr, itemId);
	return element;
};


var renderList = function(state, itemList, itemDataAttr) {
	var itemsHTML = state.items.map(function(item, index) {
		return renderItem(item, index, itemTemplate, itemDataAttr);
	});
	itemList.html(itemsHTML);
}

// event listeners

function handleItemAdds(formElement, newItemIdentifier, itemDataAttr, itemList, state) {
  formElement.submit(function(event) {
    event.preventDefault();
    var newItem = formElement.find(newItemIdentifier).val();
    addItem(state, newItem);
    renderList(state, itemList, itemDataAttr);
    this.reset();
  });
}


function handleItemToggles(itemList, toggleIdentifier, itemDataAttr, state) {
  itemList.on('click', toggleIdentifier, function(event) {
    var itemId = $(event.currentTarget.closest('li')).attr(itemDataAttr);
    var oldItem = getItem(state, itemId);

    updateItem(state, itemId, {
      itemName: oldItem.itemName,
      checkedOff: !oldItem.checkedOff
    });
    renderList(state, itemList, itemDataAttr);
  });
}


function handleItemDeletes(formElement, removeIdentifier, itemDataAttr, itemList, state) {
  itemList.on('click', removeIdentifier, function(event) {
    var itemIndex = parseInt($(this).closest('li').attr(itemDataAttr));
    deleteItem(state, itemIndex);
    renderList(state, itemList, itemDataAttr);
  });
}



function makeShoppingList() {
	var formElement = $('#js-shopping-list-form');
	var itemList = $('.js-shopping-list');
	var newItemIdentifier = '#shopping-list-entry';
	var removeIdentifier = '.js-shopping-item-delete';
	var itemDataAttr = 'data-list-item-id';
	var toggleIdentifier = '.js-shopping-item-toggle';

	handleItemAdds(formElement, newItemIdentifier, itemDataAttr, itemList, state);
	handleItemDeletes(formElement, removeIdentifier, itemDataAttr, itemList, state);
	handleItemToggles(itemList, toggleIdentifier, itemDataAttr, state);	
}


$(function () {
	makeShoppingList();
});