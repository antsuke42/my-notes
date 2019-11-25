/* global chrome */

// Define elements
const textarea = document.getElementById("textarea");
const clearPage = document.getElementById("clearPage");
const newPage = document.getElementById("newpage");
const deletePage = document.getElementById("deletePage");

// Get notes from storage
chrome.storage.sync.get(["mynotes"], data => {
  console.log(data)
  var result = data;
  var selectedPage = "";
  var current_page = Object.keys(result.mynotes)[0];

  if(result.mynotes[current_page] && result.mynotes[current_page].value == "") toggleEditable();

  // If there is no saved notes, create empty page
  if (result.mynotes[current_page]) {
    textarea.value = result.mynotes[current_page].value;
  } else {
    addNewPage();
    textarea.value = "";
  }

  // Create dropdown of existing notes
  function generatePages() {
    let firstElement = true;
    document.getElementById("pagesList").innerHTML = "";
    for (const [page, values] of Object.entries(result.mynotes)) {
      var list = document.getElementById("pagesList");
      var li = document.createElement("li");
      if (firstElement == true) {
        li.setAttribute("class", "pageButton active");
      } else {
        li.setAttribute("class", "pageButton");
      }
      li.appendChild(document.createTextNode(values.name ? values.name : page));
      list.appendChild(li);
      firstElement = false;
      li.addEventListener("contextmenu", e => pageButtonMenu(e), false);
    }
    generateEventForPages();
  }
  generatePages();

  // Toggle custom context menu
  function pageButtonMenu(e) {
    let element = document.getElementById("menu");
    element.classList.toggle("hide");
    element.setAttribute(
      "style",
      `top:${e.pageY}px; left:${e.pageX}px; position:absolute`
    );
    selectedPage = e.toElement.innerHTML;
    document.getElementById("selectedPage").innerHTML = selectedPage;
  }

  // Toggle textarea editable
  function toggleEditable() {
    document.getElementById("textarea").disabled = !document.getElementById(
      "textarea"
    ).disabled;
    document.getElementById("textarea").focus;
    document.getElementById("textarea").classList.toggle("blur");
  }

  // Set textarea value
  function setNewValue(value) {
    result.mynotes[current_page].value = value;
    chrome.storage.sync.set({
      mynotes: result.mynotes
    });
  }

  // Hotkey to blur/unblur
  document.onkeyup = function(e) {
    if (e.ctrlKey && e.which == 81) {
      toggleEditable();
    }
  };
  // Save text area value
  textarea.addEventListener("input", value => {
    setNewValue(textarea.value);
  });

  // Generate events for page menu buttons
  function generateEventForPages() {
    var classname = document.getElementsByClassName("pageButton");

    for (var i = 0; i < classname.length; i++) {
      classname[i].addEventListener(
        "click",
        function(e) {
          current_page = e.toElement.innerHTML;
          textarea.value = result.mynotes[e.toElement.innerHTML].value;
          getActiveItems();
          this.classList.add("active");
        },
        false
      );
    }
  }

  // Get active page and disable active page style from pages menu
  function getActiveItems() {
    const list = document.getElementsByClassName("active");
    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove("active");
    }
  }

  // Disable default context menu
  document.getElementById("body").addEventListener(
    "contextmenu",
    function(e) {
      e.preventDefault();
    },
    false
  );

  // -- LISTENERS
  newPage.addEventListener("click", () => {
    addNewPage();
  });

  deletePage.addEventListener("click", () => {
    deleteCurrentPage();
  });

  clearPage.addEventListener("click", () => {
    clearSelectedPage();
  });

  // -- Functions for menu buttons
  function clearSelectedPage() {
    if (result.mynotes[selectedPage].value) {
      result.mynotes[selectedPage].value = "";

      chrome.storage.sync.set({
        mynotes: result.mynotes
      });
    }
    if (selectedPage == current_page) {
      textarea.value = "";
    }
  }

  function deleteCurrentPage() {
    delete result.mynotes[selectedPage];
    current_page = Object.keys(result.mynotes)[0];
    chrome.storage.sync.set({
      mynotes: result.mynotes
    });
    generatePages();
  }

  function addNewPage() {
    let newPage = Math.random()
      .toString(36)
      .substring(7);
    result.mynotes[newPage] = {
      name: "",
      value: ""
    };
    chrome.storage.sync.set({
      mynotes: result.mynotes
    });
    current_page = Object.keys(result.mynotes)[0];
    generatePages();
  }

  document.getElementById("blurPage").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEditable();
  });

  document.getElementById("body").addEventListener("click", function(e) {
    let menu = document.getElementById("menu");
    if (menu.classList[0] != "hide") {
      menu.classList.toggle("hide");
    }
  });
});
