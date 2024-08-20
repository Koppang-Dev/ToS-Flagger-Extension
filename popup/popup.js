  // ELEMENTS
const checkCounterElement = document.getElementById("checkedCount")

// Button Elements
const startButton = document.getElementById("startButton")
const stopButton = document.getElementById("stopButton")


startButton.onclick = () => {
    const prefs = {
        checkedCounter: checkCounterElement.textContent
    }

    checkedCount += 1

    chrome.runtime.sendMessage({ event: 'onStart', prefs})
}

stopButton.onclick = () => { 
    chrome.runtime.sendMessage({ event: 'onStop'})
}

// Retrieve saved data
chrome.storage.local.get(["checkedCount"], (result) => {
    const {checkedCount} = result;

    // Checking if elements are valud
    if (checkedCount) {
        checkCounterElement.textContent = checkedCount
    }

})