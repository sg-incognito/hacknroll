let url = window.location.href;
// IMPLEMENT AUTO-RESTORE FUNCTION FOR INITIAL PAGE LOAD
console.log("Detected Form Page, Check if Save Exists");
var hasSave = true;
try {
    chrome.storage.sync.get("govtech_app", function (items) {
        console.log("Found Saved Data!");
    });
} catch (error) {
    console.error("[Govtech Autosave] Saved Data Does Not Exist: " + error);
    hasSave = false;
}
if (true) { // TODO: CHANGE TO CHECK IF SAVE FILE EXISTS IN CHROME STORAGE!
    var r = confirm("Restore previously stored form data?");
    if (r == true) {
        // Restore Data
        console.log("Data Restore Requested.");
        setTimeout(function () {
            console.log(document.querySelectorAll("input"));
            try {
                console.log("Restoring Form Data...");
                // TODO: Implement Restore Function from Storage 
                // Restore function
                chrome.storage.sync.get("govtech_app", function (items) {
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
                            for (let key in allElements) {
                                if (allElements.hasOwnProperty(key)) {
                                    const element = allElements[key]
                                    if (element.id === item) {
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
                            for (let key in allElements) {
                                if (allElements.hasOwnProperty(key)) {
                                    const element = allElements[key]
                                    if (element.id === item) {
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
                document.querySelectorAll("input").forEach(function (e) {
                    var event = new Event('input');
                    e.dispatchEvent(event);
                });
            } catch (error) {
                console.error("[Govtech Autosave] Error Restoring Form Data: " + error);
            }
        }, 500);
    } else {
        // Do nothing
        console.log("User has declined form restore.");
    }
} else {
    console.log("Save file does not exist.");
}

// IMPLEMENT AUTO-SAVE FUNCTION
setInterval(saveContent, 5000);

function saveContent() { // Runs every 5 Seconds
    try {
        console.log("Saving Form Data...");
        // TODO: Implement Save Function to Storage Map
        // Save content
        var content = {};
        document.querySelectorAll("input").forEach(function (e) {
            if (e.type == "checkbox") {
                if (content[e.id] == undefined) {
                    content[e.id] = { __checkbox: true };
                }
                content[e.id][e.value] = e.checked;
            } else if (e.type == "radio") {
                if (e.checked) {
                    var selected = { __radio: true };
                    selected["selected"] = e.value;
                    content[e.id] = selected;
                }
            } else {
                content[e.id] = e.value;
            }
        });

        var data = {};
        data[url] = content;
        // Then save to local data
        chrome.storage.sync.set({ "govtech_app": data }, function () {
        });
    } catch (error) {
        console.error("[Govtech Autosave] Error Saving Form Data: " + error);
    }
    console.log("Saved Successfully.");
    console.log(document.querySelectorAll("input"));
}