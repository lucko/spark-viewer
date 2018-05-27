let theme = "Dark";

function setTheme(t) {
    theme = t;
    Cookies.set("theme", theme);
    applyTheme();
}

function applyTheme() {
    const head = $("head");

    head.find("#theme").first().remove();
    head.append('<link id="theme" rel="stylesheet" type="text/css" href="assets/theme/' + theme + '-theme.css">');

    drawSelector();
}

function makeToggleElement(t, active) {
    if (active) {
        return t;
    } else {
        return '<span style="cursor: pointer" onclick=\'setTheme("' + t +'")\'>' + t + '</span>';
    }
}

function drawSelector() {
    const lightIsActive = theme === "Light";
    $("#theme-selector").html(makeToggleElement("Light", lightIsActive) + "/" + makeToggleElement("Dark", !lightIsActive));
}

function readThemePreference() {
    if (Cookies.get("theme") === "Light") {
        theme = "Light";
        applyTheme();
    }
}

// read the users theme setting from cookies
readThemePreference();

// draw the selector
$(drawSelector);