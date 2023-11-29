const regex = /(?<=.*\.google\.com\/search\?(?:q=|.*&q=))[^&\s]*/;
let loading = new Set();

browser.tabs.onUpdated.addListener(function (tabId) {
    // Get the current URL of the activated tab
    browser.tabs.get(tabId, function (tab) {
        var currentURL = tab.url;
        console.log('Current URL in activated tab:', currentURL);

        if(!regex.test(currentURL)) {
            console.log("not matching");
            return;
        } else if(loading.has(tabId)) {
            console.log("we done");
            return;
        }

        var match = regex.exec(currentURL)[0];

        console.log("match " + currentURL);
        console.log(match);
        
        switch(match) {
        case null:
            break;
        case "white":
            console.log("reloading");
            const page = browser.tabs.update(tabId, {
                url: "/white.html",
            });
            loading.add(tabId);
        }
    });
});
