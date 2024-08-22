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
    }
})


// Handling Stop and start buttons
const handleOnStop = () => {
    console.log("On stop in background");
}

// Handling start button
const handleOnStart = (prefs) => {
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
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error))
}
