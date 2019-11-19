/* global chrome */

const textarea = document.getElementById("textarea");
const clearPage = document.getElementById("clearPage");

chrome.storage.sync.get(["mynotes"], result => {
  let current_page = 1;
  let decrypted = true;

  if (result.mynotes[current_page]) {
    textarea.value = result.mynotes[current_page].value;
  } else {
    textarea.value = "";
  }

  console.log(result);

  function setNewValue(value, page, result) {
    let updated = {
      ...result.mynotes,
      [page]: {
        value: value
      }
    };

    chrome.storage.sync.set({
      mynotes: updated
    });
  }

  function clearCurrentPage(page) {
    let updated = {
      ...result.mynotes,
      [page]: {
        value: ""
      }
    };

    chrome.storage.sync.set({
      mynotes: updated
    });
    textarea.value = "";
  }

  clearPage.addEventListener("click", () => {
    clearCurrentPage(current_page);
  });

  if (decrypted == true) {
    textarea.addEventListener("click", () => {
      document.getElementById("textarea").classList.remove("blur");
    });
    textarea.addEventListener("input", value => {
      setNewValue(textarea.value, current_page, result);
    });
  }

  document.getElementById("body").addEventListener(
    "contextmenu",
    function(e) {
      e.preventDefault();
      var element = document.getElementById("menu");
      element.classList.toggle("hide");
      element.setAttribute(
        "style",
        `top:${e.pageY}px; left:${e.pageX}px; position:absolute`
      );
    },
    false
  );
});
