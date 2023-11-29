const regex = /(?<=.*\.google\.com\/search\?(?:q=|.*&q=))[^&\s]*/;
const IGNORE_CASE = true;
const COLOR_LIST = [
    "white",
    "black",
    "red"
];
const htmlTempl = `
<!DOCTYPE html>
<html><head>
    <style>
        body {
            background-color: COLOR;
        }
    </style>
</head></html>
`;

let loading = new Set();

browser.tabs.onUpdated.addListener(function(tabId) {
    
    getUrl(tabId)
    .then((url) => {
        var tab = {
            url: url
        }
        console.info("URL: " + url);
        if(!checkUrl(url, tabId)) {
            return null;
        }

        let query = getQuery(url);
        if(query == null) {
            return null;
        }
        
        if(IGNORE_CASE) {
            query = query.toLowerCase();
        }
        console.info("Query: " + query);

        if(!validColor(query)) {
            console.info("Query doesn't match the color list");
            return null;
        }

        console.info("Valid color, redirecting...");

        editedHtml = htmlTempl.replace("COLOR", query);
        const blob = new Blob([editedHtml], { type: 'text/html' });

        // Create a URL for the Blob using the chrome-extension: scheme
        const blobUrl = URL.createObjectURL(blob);

        // Use chrome.tabs.update to update the tab with the new HTML
        chrome.tabs.update(tabId, { url: blobUrl }).then(() => {
            loading.delete(tabId);
            console.info("Removed tabId " + tabId);
        });

        // Revoke the Blob URL to release resources
        URL.revokeObjectURL(blobUrl);
        loading.add(tabId);
    });
});

function getUrl(tabId) {
    // Get the current URL of the activated tab
    return browser.tabs.get(tabId)
        .then((tab) => {
            var currentURL = tab.url;
            return currentURL;
    });
}

function checkUrl(currentURL, currentTab) {
    if(!regex.test(currentURL)) {
        console.info("Url doesn't match");
        return false;
    } else if(loading.has(currentTab)) {
        console.info("Url is on cooldown");
        return false;
    }
    console.info("Url matches");
    return true;
}

function getQuery(url) {
    return regex.exec(url)[0];
}

function validColor(color) {
    var s = new Option().style;
    s.color = color;
    return s.color == color;
}

function changeBackground() {
    browser.tabs.executeScript(tabId, { code: 'console.log(document);' });
    document.getElementById("background").style.backgroundColor("background-color: red");
}
