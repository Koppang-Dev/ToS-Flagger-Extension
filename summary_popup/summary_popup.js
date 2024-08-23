document.addEventListener('DOMContentLoaded', () => {
    // Fetch the summary content from chrome storage
    chrome.storage.local.get('tosSummary', (data) => {
        const summaryDiv = document.getElementById('summary');
        if (summaryDiv) {
            formatText = formatSummary(data.tosSummary);
            summaryDiv.innerHTML = formatText || 'No summary available'; // Set summary or a default message
        } else {
            console.error('Element with id "summary" not found');
        }
    });
});

function formatSummary(text) {
    // Basic processing of the summary text into HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Italics text
        .replace(/^\*\*\s(.*?)\s\*\*$/gm, '<h2>$1</h2>') // Section headers
        .replace(/^\d+\.\s(.*?)$/gm, '<h3>$1</h3>')     // Numbered headers
        .replace(/\n/g, '<br>')                         // Line breaks
        .replace(/(?:^|\n)\s*\*\s*(.*?)(?:\n|$)/g, '<ul><li>$1</li></ul>') // List items
        .replace(/<\/ul>\s*<ul>/g, '')                  // Remove extra <ul> tags
        .replace(/<\/li>\s*<li>/g, '')                  // Remove extra <li> tags
        .replace(/<\/ul>\s*<br>/g, '<br>');             // Fix list breaks
}