const menuContainerDiv = document.getElementById("menu-div");
const itemDivs = menuContainerDiv.querySelectorAll("div");
const tableContainerDiv = document.getElementById("all-tables-div");
const tableDivs = tableContainerDiv.querySelectorAll("div");

// Add event listeners to table and item div elements
for (const div of itemDivs) {
  div.addEventListener("dragstart", dragStart);
  div.addEventListener("dragend", dragEnd);
}

for (const div of tableDivs) {
  div.addEventListener("dragover", dragOver);
  div.addEventListener("drop", dragDrop);
}

function dragStart(dragEvent) {
  console.log("In dragStart");
}

function dragEnd(dragEvent) {
  console.log("In dragEnd");
}

function dragOver(event) {
  // Necessary to trigger 'drop' event
  event.preventDefault();
}

function dragDrop(event) {
  console.log("in drag drop");
}

/**
 * Takes parent div id as parameter, fetches the search keyword &
 * filters the child divs(the contents) accordingly.
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
