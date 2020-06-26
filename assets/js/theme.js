const THEMES = ["spark", "WarmRoast", "Solarized Dark", "Solarized Light"];
const THEME_IDS = ["spark", "warmroast", "solarized-dark", "solarized-light"];
let theme = "spark";

function setTheme(t) {
    theme = t;
    Cookies.set("theme", theme);
    applyTheme();
    drawSelector();
}

function applyTheme() {
    const head = $("head");

    head.find("#theme").first().remove();
    head.append(`<link id="theme" rel="stylesheet" type="text/css" href="assets/theme/${theme}-theme.css">`);
}

// listen for mapping selections
function setup() {
    $("#header").on("change", "#theme-selector > select", function(e) {
        setTheme(this.value);
    });

    drawSelector();
}

function drawSelector() {
    let html = '<select title="theme"><optgroup label="Theme">';
    for (const option of THEMES) {
        const id = option.toLowerCase().replace(" ", "-");
        if (theme === id) {
            html += `<option selected value="${id}">${option}</option>`;
        } else {
            html += `<option value="${id}">${option}</option>`;
        }
    }
    html += '</optgroup></select>';

    $("#theme-selector").html(html);
}

function readThemePreference() {
    let themeRead = Cookies.get("theme");
    if (!themeRead) {
        return
    }

    if (THEME_IDS.indexOf(themeRead) === -1) {
        return;
    }

    themeRead = themeRead.toLowerCase();
    if (themeRead !== theme) {
        theme = themeRead;
        applyTheme();
    }
}

// read the users theme setting from cookies
readThemePreference();

// draw the selector
$(setup);
