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