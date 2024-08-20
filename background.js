// Called when installed or updated
chrome.runtime.onInstalled.addListener(details => {
    console.log("on Installed reason:", details.reason)

})

// Message Listeer
chrome.runtime.onMessage.addListener(data => {

    const {event, prefs} = data

    switch(event) {
        case 'onStop':
            handleOnStop();
            break;
        case 'onStart':
            handleOnStart(prefs);
            break;
    }
})


// Handling Stop and start buttons
const handleOnStop = () => {
    console.log("On stop in background");
}

const handleOnStart = (prefs) => {
    console.log("On start in background");
    console.log("Prefs output:", prefs);
    chrome.storage.local.set(prefs); // Pulling Data from local storage
}

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === 'onStart') {
        // Inject the content script into the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            // Identifying tabs
            if (tabs.length > 0) {
                const tabID = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                });
            }
            
        });
    }
});