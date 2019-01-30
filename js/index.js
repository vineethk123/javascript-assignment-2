const menuContainerDiv = document.getElementById("menu-div");
const itemDivs = menuContainerDiv.querySelectorAll("div");
const tableContainerDiv = document.getElementById("all-tables-div");
const tableDivs = tableContainerDiv.querySelectorAll("div");
let modalElement = document.getElementsByClassName("modal")[0];
let allTableOrders = {};
let modalBodyElement = document.getElementsByClassName("modal-body")[0];

// Add event listeners related to dragging to table and item div elements
for (const div of itemDivs) {
  div.addEventListener("dragstart", dragStart);
}

for (const div of tableDivs) {
  div.addEventListener("dragover", dragOver);
  div.addEventListener("drop", dragDrop);
}

/**
 * Has information related to orders of a particular table and methods that operate on them.
 */
class Table {
  constructor() {
    this.itemInformationList = [];
  }

  /**
   * Returns itemInformationList.
   */
  getItemInformationList() {
    return this.itemInformationList;
  }

  /**
   * Take name, price and count of an item and add it to itemInformationList.
   * @param {string} itemName
   * @param {number} itemPrice
   * @param {number} itemCount
   */
  addItemInformation(itemName, itemPrice, itemCount) {
    let itemInformation = {
      name: itemName,
      price: itemPrice,
      count: itemCount
    };
    this.itemInformationList.push(itemInformation);
  }

  /**
   * Check if an item exists in itemInformationList with name 'itemName' and return a boolean.
   * @param {string} itemName
   */
  getItemIndexByName(itemName) {
    let itemInformationListIterator = this.itemInformationList.entries();
    for (let entry of itemInformationListIterator) {
      if (entry[1].name === itemName) {
        return entry[0];
      }
    }
    return -1;
  }

  /**
   * Delete an item from itemInformationList by it's name.
   * @param {string} itemName
   */
  deleteItemByName(itemName) {
    let itemIndex = this.getItemIndexByName(itemName);
    if (itemIndex !== -1) {
      this.itemInformationList.splice(itemIndex, 1);
    } else {
      console.log(
        "Item by name '" +
          itemName +
          "' doesn't exist. So, it can't be deleted."
      );
    }
  }

  /**
   * Increment the count of an item named 'itemName'.
   * @param {string} itemName
   */
  incrementItemCountByName(itemName, additionalItemCount) {
    let itemIndex = this.getItemIndexByName(itemName);
    this.itemInformationList[itemIndex].count += additionalItemCount;
  }

  /**
   * Set the count of an item named 'itemName'.
   * @param {string} itemName
   * @param {number} itemCount
   */
  setItemCoutByName(itemName, itemCount) {
    let itemIndex = this.getItemIndexByName(itemName);
    this.itemInformationList[itemIndex].count = itemCount;
  }

  /**
   * Return  total bill for the table.
   */
  getTotalBill() {
    let totalBill = 0;
    for (let itemInformation of this.itemInformationList) {
      totalBill += itemInformation.price * itemInformation.count;
    }
    return totalBill;
  }

  /**
   * Return the count of all items ordered from the table.
   */
  getAllItemCount() {
    let allItemCount = 0;
    for (let itemInformation of this.itemInformationList) {
      allItemCount += itemInformation.count;
    }
    return allItemCount;
  }
}

/**
 * Triggered when one starts dragging a draggable element.
 * @param {Object} dragEvent
 */
function dragStart(dragEvent) {
  let draggedItemElement = dragEvent.srcElement;
  let draggedItemName = draggedItemElement.querySelector("p.card-title")
    .innerText;
  let draggedItemPrice = draggedItemElement.querySelector("p.card-content")
    .innerText;
  // dataTransfer property is used to hold the data that is being dragged.
  // setData() is used to store the data in the dataTranfer object during drag operation.
  dragEvent.dataTransfer.setData(
    "text/plain",
    draggedItemName + "," + draggedItemPrice
  );
}

/**
 * Triggered when the dragged object is moved over an element that has 'dragover' event listener attached.
 * @param {Object} dragEvent
 */
function dragOver(dragEvent) {
  // Prevent default behaviour to trigger 'drop' event
  dragEvent.preventDefault();
}

/**
 * Triggered when the dragged element is dropped on an element with 'drop' event listener attached.
 * Populates the allTableOrders as per the dragged item and dropped table.
 * @param {Object} draggableEvent
 */
function dragDrop(dragEvent) {
  let draggedItemContent = dragEvent.dataTransfer
    .getData("text/plain")
    .split(",");
  let draggedItemName = draggedItemContent[0];
  let draggedItemPrice = parseFloat(draggedItemContent[1]);
  let droppedTableId = this.getAttribute("id");

  // Populate a table's new order in allTableOrders
  // Create an entry for a table along with the dragged item if no orders were placed for that table.
  // If a new item is added to an existing table make an entry for it.
  // If an existing item is ordered in an existing table increment the count of that item for that table by 1.
  if (typeof allTableOrders[droppedTableId] === "undefined") {
    allTableOrders[droppedTableId] = new Table();
    allTableOrders[droppedTableId].addItemInformation(
      draggedItemName,
      draggedItemPrice,
      1
    );
  } else if (
    allTableOrders[droppedTableId].getItemIndexByName(draggedItemName) === -1
  ) {
    allTableOrders[droppedTableId].addItemInformation(
      draggedItemName,
      draggedItemPrice,
      1
    );
  } else {
    allTableOrders[droppedTableId].incrementItemCountByName(draggedItemName, 1);
  }
  renderTableContent(this.getAttribute("id"));
}

/**
 * Render/update a single table's content from 'allTableOrders' - price and count
 * @param {object} targetTableElement
 * @param {object} dragEvent
 */
function renderTableContent(targetTableId) {
  let targetTableElement = tableContainerDiv.querySelector("#" + targetTableId);
  let priceSpanElement = targetTableElement.querySelector(
    "span[data-name='price']"
  );
  let itemCountSpanElement = targetTableElement.querySelector(
    "span[data-name='item-count']"
  );
  if (allTableOrders[targetTableId]) {
    priceSpanElement.innerText = allTableOrders[targetTableId].getTotalBill();
    itemCountSpanElement.innerText = allTableOrders[
      targetTableId
    ].getAllItemCount();
  } else {
    priceSpanElement.innerText = 0;
    itemCountSpanElement.innerText = 0;
  }
}

/**
 * Takes a container div id as parameter, fetches the search keyword &
 * filters the child divs(the contents) accordingly.
 * @param {string} containerDivId
 */
function filterContent(containerDivId) {
  let containerDiv = document.getElementById(containerDivId);
  let searchKeyword = containerDiv.querySelector("input").value.toLowerCase();
  let childDivs = containerDiv.querySelectorAll("div");

  // For each div, see if the search keyowrd matches either with card title or their meta data (if any)
  // If match is found, leave it as it is else make it disappear
  childDivs.forEach(function(div) {
    let cardTitle = div.querySelector(".card-title").innerText.toLowerCase();
    if (cardTitle.indexOf(searchKeyword) > -1) {
      div.style.display = "";
    } else if (
      div.getAttribute("data-course-type") !== null &&
      div.getAttribute("data-course-type").indexOf(searchKeyword) > -1
    ) {
      div.style.display = "";
    } else {
      div.style.display = "none";
    }
  });
}

/**
 * Turn the clicked table div yellow and show the pop-up.
 * @param {string} tableId
 */
function showModal(tableId) {
  // Make the background color of clicked table-div yellow
  let currentTableDiv = document.getElementById(tableId);
  currentTableDiv.style.backgroundColor = "yellow";
  // Get the name of the table clicked to display on pop-up header.
  let tableTitle = currentTableDiv.querySelector(".card-title").innerText;
  modalElement = document.getElementsByClassName("modal")[0];
  modalElement.querySelector("#table-name-for-modal").innerText = tableTitle;
  // Fill the modal items' information ordered by the table.
  populateModal(tableId);
  // Make the modal visible
  modalElement.style.display = "block";
}

/**
 * Populate the modal with order information related to the table with id tableId.
 * @param {string} tableId
 */
function populateModal(tableId) {
  // Check if the table has started giving orders
  if (allTableOrders[tableId]) {
    let itemInformationListIterator = allTableOrders[tableId]
      .getItemInformationList()
      .entries();
    for (let entry of itemInformationListIterator) {
      let serialNumber = entry[0] + 1,
        itemName = entry[1].name,
        itemPrice = entry[1].price,
        itemCount = entry[1].count,
        inputElementId = "input-" + serialNumber,
        divContainer = createNode("div", "", {
          class: "modal-body-row",
          "data-serial-number": "" + serialNumber
        }),
        itemCountDiv = createNode("div", "", { class: "col-4 item-count-div" }),
        labelElement = null,
        inputElement = null;
      divContainer.appendChild(
        createNode("span", serialNumber, { class: "col-1 modal-row-element" })
      );
      divContainer.appendChild(
        createNode("span", itemName, { class: "col-2 modal-row-element" })
      );
      divContainer.appendChild(
        createNode("span", itemPrice, { class: "col-3 modal-row-element" })
      );
      labelElement = createNode("label", "Number of Servings", {
        class: "modal-body-row__label",
        for: "" + inputElementId
      });
      inputElement = createNode("input", "", {
        id: "" + inputElementId,
        class: "modal-body-row__input",
        type: "number",
        min: "1",
        max: "20",
        value: "" + itemCount
      });
      inputElement.addEventListener("focus", toggleBorderAndLabelColor);
      inputElement.addEventListener("blur", updateItemCount);
      itemCountDiv.appendChild(labelElement);
      itemCountDiv.appendChild(inputElement);
      divContainer.appendChild(itemCountDiv);
      let binSpanElement = createNode("span", "", {
        class: "col-5 modal-row-element"
      });
      binSpanElement.onclick = function() {
        deleteItem(tableId, itemName);
      };
      binSpanElement.appendChild(
        createNode("img", "", {
          class: "delete-icon",
          src: "images/delete-icon.svg"
        })
      );
      divContainer.appendChild(binSpanElement);
      modalBodyElement.appendChild(divContainer);
    }
    // If a table is occupied and has given some orders, show them the total.
    if (allTableOrders[tableId].getItemInformationList().length !== 0) {
    } else {
      // Prompt them to order something.
      let divContainer = createNode("div", "", {
        class: "modal-body-row",
        "data-serial-number": "-2"
      });
      divContainer.appendChild(
        createNode("span", "Delicious food is waiting for you! Order Soon!", {
          class: "no-orders-span"
        })
      );
      modalBodyElement.appendChild(divContainer);
    }
  } else {
    let divContainer = createNode("div", "", {
      class: "modal-body-row",
      "data-serial-number": "-1"
    });
    divContainer.appendChild(
      createNode("span", "No one is at the table!", { class: "no-orders-span" })
    );
    modalBodyElement.appendChild(divContainer);
  }
}

/**
 * Create an HTML element with the specified innertext and CSS classes and return it.
 * @param {string} elementName
 * @param {string} innerText
 * @param {Array} attributes
 */
function createNode(elementName, innerText, attributes) {
  let htmlElement = document.createElement(elementName);
  let selfClosingElements = ["img", "input"];
  // Set innerText only for non self-closing element.
  if (selfClosingElements.indexOf(elementName) === -1) {
    htmlElement.innerText = innerText;
  }
  for (let [attribute, value] of Object.entries(attributes)) {
    htmlElement.setAttribute(attribute, value);
  }
  if (innerText === "No Orders Yet!") {
    htmlElement.classList.add("no-orders-row");
  }
  return htmlElement;
}

function toggleBorderAndLabelColor(inputEvent) {
  let inputElementId = inputEvent.srcElement.getAttribute("id");
  let labelElement = modalBodyElement.querySelector(
    "label[for='" + inputElementId + "']"
  );
  if (labelElement.className === "modal-body-row__label") {
    labelElement.setAttribute("class", "modal-body-row__label--focus");
  } else {
    labelElement.setAttribute("class", "modal-body-row__label");
  }
}

/**
 * When the focus goes out of the inout element, fetch the count for that item and update it,
 * both in memory and on screen.
 * @param {Object} blurEvent
 */
function updateItemCount(blurEvent) {
  let targetDivElement,
    newItemCount,
    inputElementId,
    targetSpanElement,
    itemName;
  inputElementId = blurEvent.srcElement.getAttribute("id");
  newItemCount = parseInt(
    modalBodyElement.querySelector("#" + inputElementId).value
  );
  tableId = getCorrespodingTableIdForModal();
  targetDivElement = modalBodyElement.querySelector(
    "div[data-serial-number='" + inputElementId.slice(-1) + "']"
  );
  targetSpanElement = targetDivElement.querySelectorAll("span")[1];
  itemName = targetSpanElement.innerText;
  allTableOrders[tableId].setItemCoutByName(itemName, newItemCount);
  toggleBorderAndLabelColor(blurEvent);
  renderTableContent(tableId);
}

/**
 * Return the table id for which the modal is being displayed.
 */
function getCorrespodingTableIdForModal() {
  let tableName = modalElement.querySelector("#table-name-for-modal").innerText;
  for (let tableDiv of tableDivs) {
    let tableDivTitle = tableDiv.querySelector(".card-title").innerText;
    if (tableDivTitle === tableName) {
      currentTableDiv = tableDiv;
    }
  }
  return currentTableDiv.getAttribute("id");
}

/**
 * Delete the item from the table orders and update the data on table div & modal
 * @param {string} tableId
 * @param {string} itemName
 */
function deleteItem(tableId, itemName) {
  deleteAllItemsFromModal(tableId);
  allTableOrders[tableId].deleteItemByName(itemName);
  populateModal(tableId);
  renderTableContent(tableId);
}

/**
 * Hide the modal and turn the clicked table div's background color to white
 */
function hideModal() {
  let currentTableDiv = null,
    currentTableId;
  modalElement.style.display = "none";
  // Find the table for which the modal is being displayed.
  let currentTableDivId = getCorrespodingTableIdForModal();
  currentTableDiv = tableContainerDiv.querySelector("#" + currentTableDivId);
  currentTableDiv.style.backgroundColor = "white";
  // Remove all divs appended the modal.
  currentTableId = currentTableDiv.getAttribute("id");
  deleteAllItemsFromModal(currentTableId);
}

function deleteAllItemsFromModal(tableId) {
  let allAppendedElements = modalBodyElement.querySelectorAll(
    "div[data-serial-number]"
  );
  for (appendedElement of allAppendedElements) {
    appendedElement.remove();
  }
}

function closeTableSession() {
  let currentTableDiv = null,
    currentTableId;
  // Find the table for which the modal is being displayed.
  let tableName = modalElement.querySelector("#table-name-for-modal").innerText;
  for (let tableDiv of tableDivs) {
    let tableDivTitle = tableDiv.querySelector(".card-title").innerText;
    if (tableDivTitle === tableName) {
      currentTableDiv = tableDiv;
    }
  }
  currentTableId = currentTableDiv.getAttribute("id");
  delete allTableOrders[currentTableId];
  renderTableContent(currentTableId);
  hideModal();
}

function clearCurrentTable() {}

// Clicking anywhere on the screen other than on the modal (when the modal is active) should hide the modal.
window.onclick = function(event) {
  if (event.target == modalElement) {
    hideModal();
  }
};
