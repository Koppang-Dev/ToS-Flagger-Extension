  // ELEMENTS
const checkCounterElement = document.getElementById("checkedCount")

// Button Elements
const startButton = document.getElementById("startButton")

startButton.onclick = () => {
    const prefs = {
        checkedCounter: checkCounterElement.textContent
    }


    chrome.runtime.sendMessage({ event: 'onStart', prefs})
}


// Retrieve saved data
chrome.storage.local.get(["checkedCount"], (result) => {
    const {checkedCount} = result;

    // Checking if elements are valud
    if (checkedCount) {
        checkCounterElement.textContent = checkedCount
    }

})