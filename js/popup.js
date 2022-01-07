let saveForm = document.getElementById("saveForm");
let restoreForm = document.getElementById("restoreForm");

// When the button is clicked, trigger function
saveForm.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('You clicked something!');
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: saveFormData,
  });
});

// When the button is clicked, trigger function
restoreForm.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: restoreFormData,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function saveFormData() {
  console.log('HI!');
}

// The body of this function will be executed as a content script inside the
// current page
function restoreFormData() {
  console.log('HI!');
}
