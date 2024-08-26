// Called when installed or updated
chrome.runtime.onInstalled.addListener(details => {
    console.log("on Installed reason:", details.reason)

})

// Message Listeer
chrome.runtime.onMessage.addListener(data => {

    const {event, prefs, headerContentPairs} = data

    switch(event) {
        case 'onStop':
            handleOnStop();
            break;
        case 'onStart':
            handleOnStart(prefs);
            break;
        case 'sendData':
            // Data recieved from content script
            console.log(headerContentPairs);
            sendDataToServer(headerContentPairs);
            break;
        case 'updatePopup':
            // Show the user the summarized and highlighted data
            chrome.storage.local.get('tosSummary', (data) =>{
                chrome.runtime.sendMessage({event: 'updatePopupContent', content: data.tosSummary});
            });
            break;
    }
})


// Handling Stop and start buttons
const handleOnStop = () => {
    console.log("On stop in background");
}

// Handling start button
const handleOnStart = (prefs) => {

    // 
    console.log("On start in background");
    console.log("Prefs output:", prefs);
    chrome.storage.local.set(prefs); // Pulling Data from local storage
    injectIntoTabs();
     
}


// Search for active tab and inject content script
function injectIntoTabs() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

        console.log('Tabs Found', tabs);

        if (tabs.length > 0) {
           
            const tabID = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: tabID },
                files: ["content.js"]
            }, () => {
                console.log('Content Injected Loaded');

                // Sending message
                chrome.tabs.sendMessage(tabID, { event: 'onStart' }, (response) => {
                    console.log("Message Recieved");
                    console.log(response);
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message:', chrome.runtime.lastError);
                    } else {
                        console.log('Message sent successfully:', response);
                    }
                });
            });
        } else {
            console.log("No active tabs found");
        }
    });
}


// Sends the ToS content to Flask Server
function sendDataToServer(headerContentPairs) {
    const url = 'http://127.0.0.1:8080/process'; // Flask server URL

    console.log("Sending Data to server:", headerContentPairs);

    // HTTP request
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ headerContentPairs })
    })
    .then(response => response.json())
    .then(data => {
        // Handle Response
        console.log('Success:', data.message);
        console.log('Combined Summary:', data.Content)

        // Update checked count
        updatePagesAnalyzed();

        // Save summary to chrome storage
        chrome.storage.local.set({ tosSummary: data.Content }, () => {
            // Open the new popup
            chrome.tabs.create({ url: chrome.runtime.getURL('summary_popup/summary_popup.html') })
        });
    })
    .catch((error) => console.error('Error:', error));
}


// Will update the checked pages count in the popup
function updatePagesAnalyzed() {
    chrome.storage.local.get('checkedCount', (result) => {
        // Get previous count
        const currentCount = result.checkedCount || 0;
        const newCheckedCount = currentCount + 1;

        // Save new count
        chrome.storage.local.set({ checkedCount: newCheckedCount}, () => {
            console.log('Check count updated to:', newCheckedCount);
        });
    });
}




// Injecting Script into current tab


// Automatically start when the browser starts (called when the extension first fires up)
chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            injectIntoTabs(tabs[0].id);
        }
    })
})

// Listening for tab activation (Switching)
chrome.tabs.onActivated.addListener((activeInfo) => {
    injectIntoTabs(activeInfo.tabID);
})

// Listening for tab updates (Navigation to a new page)
chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Tab has fully loaded
        injectIntoTabs(tabID);
    }
})