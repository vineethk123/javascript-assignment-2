const menuContainerDiv = document.getElementById("menu-div");
const itemDivs = menuContainerDiv.querySelectorAll("div");
const tableContainerDiv = document.getElementById("all-tables-div");
const tableDivs = tableContainerDiv.querySelectorAll("div");
let modalElement = document.getElementsByClassName("modal")[0];
let allTableOrders = {};
let modalBodyElement = document.getElementById("modal-body");

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
    return this.itemInformationList.slice();
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
  incrementItemCountByName(itemName) {
    let itemIndex = this.getItemIndexByName(itemName);
    this.itemInformationList[itemIndex].count += 1;
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
    allTableOrders[droppedTableId].incrementItemCountByName(draggedItemName);
  }
  renderTableContent(this);
}

/**
 * Render/update a single table's content from 'allTableOrders' - price and count
 * @param {object} targetTableElement
 * @param {object} dragEvent
 */
function renderTableContent(targetTableElement) {
  let targetTableId = targetTableElement.getAttribute("id");
  let priceSpanElement = targetTableElement.querySelector(
    "span[data-name='price']"
  );
  let itemCountSpanElement = targetTableElement.querySelector(
    "span[data-name='item-count']"
  );
  priceSpanElement.innerText = allTableOrders[targetTableId].getTotalBill();
  itemCountSpanElement.innerText = allTableOrders[
    targetTableId
  ].getAllItemCount();
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
 * Populate the modal with order information related to the table having id tableId.
 * @param {string} tableId
 */
function populateModal(tableId) {
  let serialNumber = 0;
  for (let itemName in allTableOrders[tableId]) {
    serialNumber++;
    modalBodyElement.appendChild(createNode("span", serialNumber, ["col-1"]));
    modalBodyElement.appendChild(createNode("span", itemName, ["col-2"]));
    modalBodyElement.appendChild(
      createNode("span", allTableOrders[tableId][item].price, ["col-3"])
    );
    modalBodyElement.appendChild(createNode("span", "placeholder", ["col-4"]));
    let binSpanElement = createNode("span", "", ["col-5"]);
    binSpanElement.appendChild(createNode("img", "", ["delete-icon"]));
  }
}

/**
 * Create an HTML element with the specified innertext and CSS classes and return it.
 * @param {string} elementName
 * @param {string} innerText
 * @param {Array} classNames
 */
function createNode(elementName, innerText, classNames) {
  // To-Do: create nodes.
}

/**
 * Hide the modal and turn the clicked table div's background color to white
 */
function hideModal() {
  let currentTableDiv = null;
  modalElement.style.display = "none";
  let tableName = modalElement.querySelector("#table-name-for-modal").innerText;
  for (let tableDiv of tableDivs) {
    let tableDivTitle = tableDiv.querySelector(".card-title").innerText;
    if (tableDivTitle === tableName) {
      currentTableDiv = tableDiv;
    }
  }
  currentTableDiv.style.backgroundColor = "white";
}

function closeTableSession() {
  clearCurrentTable();
  hideModal();
}

function clearCurrentTable() {}

// Clicking anywhere on the screen other than on the modal (when the modal is active) should hide the modal.
window.onclick = function(event) {
  if (event.target == modalElement) {
    hideModal();
  }
};
