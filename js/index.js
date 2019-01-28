const menuContainerDiv = document.getElementById("menu-div");
const itemDivs = menuContainerDiv.querySelectorAll("div");
const tableContainerDiv = document.getElementById("all-tables-div");
const tableDivs = tableContainerDiv.querySelectorAll("div");
let modalElement = document.getElementsByClassName("modal")[0];
let currentTablediv; // div element for which the pop-up is being displayed

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
  let draggedItemPrice = draggedItemElement.querySelector("p.card-content")
    .innerText;
  // dataTransfer property is used to hold the data that is being dragged.
  // setData() is used to store the data in the dataTranfer object during drag operation.
  dragEvent.dataTransfer.setData("text/plain", draggedItemPrice);
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
 * Increments the item-count by 1 and adds the dragged item's price to total price of the target table.
 * @param {Object} draggableEvent
 */
function dragDrop(dragEvent) {
  let priceSpanElement = this.querySelector("span[data-name='price']");
  let itemCountSpanElement = this.querySelector("span[data-name='item-count']");
  let draggedItemPrice = parseFloat(
    dragEvent.dataTransfer.getData("text/plain")
  );
  let newPrice = parseFloat(priceSpanElement.innerText) + draggedItemPrice;
  priceSpanElement.innerText = newPrice;
  let tableItemCount = parseInt(itemCountSpanElement.innerText);
  itemCountSpanElement.innerText = tableItemCount + 1;
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
