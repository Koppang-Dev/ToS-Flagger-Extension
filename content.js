
// IIFE Function
(function () {

    // Check if the script has been executed on the tab already
    if (window.hasRun) {
        // Do not inject content script again
        return;
    }

    window.hasRun = true;

    console.log('Content script loaded');

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

        // User selected start 
        if (message.event === 'onStart') {

            // Defining the response for chrome runtime
            let response = { status: 'recieved' };

            if (isTermsOfServicePage()) {
                // Is a ToS page
                const { content, headers } = extractContent();
                response.content = content; // Returning content
                response.header = headers; // Returning header
            } else {
                // Not a ToS page
                response.error = 'Page is not a ToS page';
            }

            // Sending response object back
            sendReponse(response);
        }
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

            for (const element of elements) {
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

})