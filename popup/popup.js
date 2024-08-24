  // ELEMENTS
const checkCounterElement = document.getElementById("checkedCount")
const startButton = document.getElementById("startButton")

// Function to update the displayed pages analyzed label
function updateCheckedCountDisplay() {
   // Retrieve saved data
    chrome.storage.local.get(["checkedCount"], (result) => {
        const {checkedCount} = result;

        // Checking if elements are valud
        if (checkedCount) {
            checkCounterElement.textContent = checkedCount
        }

    });
}

// Dealing when user clicks the start scanning button
startButton.onclick = () => {
    const prefs = {
        checkedCounter: checkCounterElement.textContent
    }
    // Sends message to backend to deal with event
    chrome.runtime.sendMessage({ event: 'onStart', prefs})
}

// Initialize popup with saved checked count
document.addEventListener('DOMContentLoaded', updateCheckedCountDisplay);
