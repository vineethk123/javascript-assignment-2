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
