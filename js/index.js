const menuContainerDiv = document.getElementById("menu-div");
const itemDivs = menuContainerDiv.querySelectorAll("div");
const tableContainerDiv = document.getElementById("all-tables-div");
const tableDivs = tableContainerDiv.querySelectorAll("div");
let modalElement = document.getElementsByClassName("modal")[0];
let currentTablediv; // div element for which the pop-up is being displayed
let allTableOrders = {};

// Add event listeners to table and item div elements
for (const div of itemDivs) {
  div.addEventListener("dragstart", dragStart);
}

for (const div of tableDivs) {
  div.addEventListener("dragover", dragOver);
  div.addEventListener("drop", dragDrop);
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
    allTableOrders[droppedTableId] = {};
    allTableOrders[droppedTableId][draggedItemName] = {};
    allTableOrders[droppedTableId][draggedItemName]["price"] = draggedItemPrice;
    allTableOrders[droppedTableId][draggedItemName]["count"] = 1;
  } else if (
    typeof allTableOrders[droppedTableId][draggedItemName] === "undefined"
  ) {
    allTableOrders[droppedTableId][draggedItemName] = {};
    allTableOrders[droppedTableId][draggedItemName]["price"] = draggedItemPrice;
    allTableOrders[droppedTableId][draggedItemName]["count"] = 1;
  } else {
    allTableOrders[droppedTableId][draggedItemName]["count"] += 1;
  }
  renderTableContent(this);
}

/**
 * Render/update a single table's content from 'allTableOrders' - price and count
 * @param {object} targetTableElement
 * @param {object} dragEvent
 */
function renderTableContent(targetTableElement) {
  console.log("in rendertablecontent");
  let tableBill = 0,
    tableItemCount = 0;
  let targetTableId = targetTableElement.getAttribute("id");
  let priceSpanElement = targetTableElement.querySelector(
    "span[data-name='price']"
  );
  let itemCountSpanElement = targetTableElement.querySelector(
    "span[data-name='item-count']"
  );
  console.log("Elements: ", priceSpanElement, itemCountSpanElement);
  for (let item in allTableOrders[targetTableId]) {
    console.log("item: ", allTableOrders[targetTableId][item]);
    tableBill +=
      allTableOrders[targetTableId][item].price *
      allTableOrders[targetTableId][item].count;
    tableItemCount += allTableOrders[targetTableId][item].count;
  }
  console.log("Bill: ", tableBill, "\nitemcount: ", tableItemCount);
  priceSpanElement.innerText = tableBill;
  itemCountSpanElement.innerText = tableItemCount;
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

function showModal(tableId) {
  currentTablediv = document.getElementById(tableId);
  currentTablediv.style.backgroundColor = "yellow";
  let tableTitle = currentTablediv.querySelector(".card-title").innerText;
  modalElement = document.getElementsByClassName("modal")[0];
  modalElement.querySelector("#table-name-for-modal").innerText = tableTitle;
  modalElement.style.display = "block";
}

function hideModal() {
  modalElement.style.display = "none";
  currentTablediv.style.backgroundColor = "white";
  currentTablediv = undefined;
}

function closeTableSession() {
  clearCurrentTable();
  hideModal();
}

function clearCurrentTable() {}

window.onclick = function(event) {
  if (event.target == modalElement) {
    hideModal();
  }
};
