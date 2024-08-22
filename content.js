
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === 'onStart') {
        // Defining the response for chrome runtime
        let response = {status: 'received'};

        if (isTermsOfServicePage()) {
            // Is a ToS page
            const headerContentPairs = extractContent(); // Getting header and content

            // Sending scrapped data back to background script
            chrome.runtime.sendMessage({
                event: 'sendData',
                headerContentPairs: headerContentPairs
            });            
        } else {
            // Not a ToS page
            response.error = 'Page is not a ToS page';
        }

        // Sending response object back
        sendResponse(response);
    }
});

// Possible terms of services elements
let tosSelectors = [
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
    for (const selector of tosSelectors) {
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
    return false;
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

    // Initalizing header and content
    let headerContentPairs = []; // Array to store header-content pairs
    let currentHeader = null;
    let currentContent = '';
    const headerSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    // List of selectors to ignore
    const ignoreSelectors = ['.tab-bar', '.footer', '.header', '#sidebar', '#top-bar', 'path'];

     // Helper function to check if a node should be ignored 
     function shouldIgnore(node) {

        // If not element node then dont ignore
        if (node.nodeType !== Node.ELEMENT_NODE) return false;

        // Ignore if node matches ignore selectors
        if (ignoreSelectors.some(selector => node.matches(selector))) return true;


        // Check if any of the parent nodes match ignore selectors
        let parent = node.parentElement;
        while (parent) {
            if (ignoreSelectors.some(selector => parent.matches(selector))) return true;
            parent = parent.parentElement;
        }
        
        // Do not ignore
        return false;
    }

    // Processes node and accumulates content
    function processNode(node) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();

            if (shouldIgnore(node)) {
                return
            }

            // Check if the node is a header
            if (headerSelectors.includes(tagName)) {

                // If there is an exisitng header, push its contents
                if (currentHeader != null) {
                    headerContentPairs.push({
                        header: currentHeader,
                        content: currentContent.trim()
                    });
                }

                // Set the new header
                currentHeader = node.textContent.trim();
                currentContent = ''; // Set fresh

            } else if (tagName === 'p' || tagName === 'div') {
                // Adding content
                currentContent += node.textContent.trim() + ' ';
            }
            }

            // Process each child node
            node.childNodes.forEach(child => processNode(child));
        }

        // Start processing body text
        processNode(document.body);

        // Push last header-content pair if available
        if (currentHeader !== null) {
            headerContentPairs.push({
                header: currentHeader,
                content: currentContent
            });
        }

        return headerContentPairs;
    }