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
    document.querySelectorAll("input").forEach(function(e) {
      // TODO(EhWhoAmI): Check if it's a radio button
      content[e.id] = e.value;
    });

    var data = {};
    data[url] = content;
    // Then save to local data
    chrome.storage.sync.set({"govtech_app" : data}, function() {
    });
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
    chrome.storage.sync.get("govtech_app"[url], function(items) {
      for (var item in items) {
        // Set the value
        console.log(items);
      }
    });
  } else {
    console.log('Not a form.gov.sg page!');
  }
}
