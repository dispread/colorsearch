var btn_allow_primary = document.getElementById("allow_primary");

console.warn("settings.js loaded");

browser.runtime.sendMessage({ action: "getUseColorList" }, (response) => {
    btn_allow_primary.checked = response.value;
});

btn_allow_primary.addEventListener("change", function(event) {
    if(event.target.checked) {
        console.debug("Button checked");
        browser.runtime.sendMessage({ action: "only_basic_colors" });
        only_basic_colors = true;
    } else if(!event.target.checked) {
        console.debug("Button unchecked");
        browser.runtime.sendMessage({ action: "all_css_colors" });
        only_basic_colors = false;
    }
});