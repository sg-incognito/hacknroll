
// IMPLEMENT AUTO-RESTORE FUNCTION FOR INITIAL PAGE LOAD
console.log("Detected Form Page, Check if Save Exists");
if (true) { // TODO: CHANGE TO CHECK IF SAVE FILE EXISTS IN CHROME STORAGE!
    var r=confirm("Restore previously stored form data?");
    if (r==true) {
        // Restore Data
        console.log("Data Restore Requested.");
        try {
            console.log("Restoring Form Data...");
            // TODO: Implement Restore Function from Storage Map
        } catch (error) {
            console.error("[Govtech Autosave] Error Restoring Form Data: " + error);
        }
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
    } catch (error) {
        console.error("[Govtech Autosave] Error Saving Form Data: " + error);
    }
    console.log("Saved Successfully.");
}