
console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === 'onStart') {
         // Call your functions after handling the message
         if (isTermsOfServicePage()) {
            const { content, headers } = extractContent();
            console.log('Content:', content);
            console.log('Headers:', headers);
        } else {
            console.log('Page is not a ToS page');
        }
        sendResponse( {status: 'recieved'});
        // Handle the message here
    } else {
        console.log('Something went wrong');
    }

    return false;
});

// Possible terms of services elements
const possibleTOSSelectors = [
    'a[href*="terms"]',
    'a[href*="terms-of-service"]', 
    '.terms',                     
    '.terms-of-service',
    '#terms',                      
    '#terms-of-service'
];

// Checks if the page is for terms and services
function isTermsOfServicePage() {
    // Text content to check for ToS keywords
    const keywords = ["terms of service", "terms", "user agreement", "privacy policy"];

    // Check if any of the possible selectors work
    for (const selector of possibleTOSSelectors) {
        const elements = document.querySelectorAll(selector); // Checks if any ToS elements are found

        for(const element of elements) {
            // Iterating through the found ToS elements
            const textContent = element.textContent.toLowerCase();
            if (containsTOSkeys(textContent, keywords)) {
                return true;
            }
        }
    }

    // No ToS elements found
    return false
}

// Checks if text contains ToS keywords
function containsTOSkeys(text, keywords) {
    const lowercaseText = text.toLowerCase(); // Make all lowercase
    for (let i = 0; i < keywords.length; i++) {
        if (lowercaseText.includes(keywords[i])) {
            // Text contains specified keyword
            return true;
        }
    }
    // No keywords were found
    return false;
}

// Extracts the headers and body of the ToS
function extractContent() {
    let content = '';
    let headers = '';

    // Header Selectors
    const headerSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    // Extract text from entire body
    const bodyText = document.body.textContent || '';
    content += bodyText;

    // Extract Headers
    for (const headerSelectors of headerSelectors) {
        const headerElements = document.querySelectorAll(headerSelectors);

        // Finding headers
        for (const header of headerElements) {
            headers += '$(header.tagName: $${header.textContent}\n';
        }
    }

    return {
        content: content.trim(),
        headers: headers.trim()
    }
}