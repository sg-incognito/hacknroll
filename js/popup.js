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
  console.log("Running Save Function");
  let url = window.location.href;
  if (url.includes("form.gov.sg") && url.includes("http")) {
    console.log('form.gov.sg page detected, saving your data now...');
    // Save content
    var content = {};
    document.querySelectorAll("input").forEach(e => content[e.id] = e.value);
    // Then save to local data
    console.log(content);
  } else {
    console.log('Not a form.gov.sg page!');
  }
}

// The body of this function will be executed as a content script inside the
// current page
function restoreFormData() {
  console.log("Running Save Function");
  let url = window.location.href;
  if (url.includes("form.gov.sg") && url.includes("http")) {
    console.log('form.gov.sg page detected, restoring your data now...');
    // TODO: IMPLEMENT RESTORE FUNCTION
  } else {
    console.log('Not a form.gov.sg page!');
  }
}
