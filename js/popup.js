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
      if (e.type == "checkbox") {
        if (content[e.id] == undefined) {
          content[e.id] = {__checkbox: true};
        }
        content[e.id][e.value] = e.checked;
      } else if (e.type == "radio") {
        if (e.checked) {
          var selected = {__radio: true};
          selected["selected"] = e.value;
          content[e.id] = selected;
        }
      }else {
        content[e.id] = e.value;
      }
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

    // Restore function
    chrome.storage.sync.get("govtech_app", function(items) {
      var object = items["govtech_app"][url];
      console.log(object);
      for (item in object) {
        if (document.getElementById(item) === null) {
          continue;
        }
        var element_info = object[item];
        // If string
        if (Object.prototype.toString.call(object[item]) === '[object String]') {
          // Set the value
          document.getElementById(item).value = element_info;
        }
        // Checkbox handling
        else if ('__checkbox' in element_info) {
          // Not the most elegant, but it's a hackathon for a reason
          const allElements = document.getElementsByTagName('*')
          for(let key in allElements) {
              if(allElements.hasOwnProperty(key)) {
                  const element = allElements[key]
                  if(element.id === item) {
                      // Set the value
                      if (element.value in object[item]) {
                        // Then put the value
                        //element.checked = object[item][element.value];
                        if (object[item][element.value]) {
                          // Check if it needs to be clicked or not
                          if (!element.checked) {
                            element.click();
                          }
                        } else {
                          if (element.checked) {
                            element.click();
                          }
                        }
                      }
                  }
              }
          }
        }
        // Radio button handling
        else if ('__radio' in element_info) {
          // Check the right object
          const allElements = document.getElementsByTagName('*')
          for(let key in allElements) {
            if(allElements.hasOwnProperty(key)) {
                const element = allElements[key]
                if(element.id === item) {
                  if (element.value === element_info["selected"]) {
                    // Then check the element
                    element.click();
                  }
                }
            }
          }
        }
      }
    });
  } else {
    console.log('Not a form.gov.sg page!');
  }
}
