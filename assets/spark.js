// try to load the page from the url parameters when the page loads
function loadContent() {
    let params = document.location.search;
    if (params) {
        if (params.startsWith("?")) {
            params = params.substring(1);
        }

        $(".intro").hide();
        $(".loading").show().html("Loading data; please wait...");

        // get data
        const url = "https://bytebin.lucko.me/" + params;
        console.log("Loading from URL: " + url);

        $.getJSON(url, loadData).fail(showLoadingError)
    }
}

function showLoadingError() {
    $(".loading").html("An error occurred whilst loading. Perhaps the data has expired?");
}

function escapeHtml(text) {
    return text.replace(/[\"&'\/<>]/g, function(a) {
        return {
            '"': '&quot;',
            '&': '&amp;',
            "'": '&#39;',
            '/': '&#47;',
            '<': '&lt;',
            '>': '&gt;'
        }[a];
    });
}

function nodeToHtml(node, totalTime) {
    const timePercent = ((node["totalTime"] / totalTime) * 100).toFixed(2) + "%";
    let html = "";

    html += '<div class="node collapsed">';

    html += '<div class="name">';
    html += escapeHtml(node["name"]);
    html += '<span class="percent">' + timePercent + '</span>';
    html += '<span class="time">' + node["totalTime"] + 'ms</span>';
    html += '<span class="bar"><span class="bar-inner" style="width: ' + timePercent + '"></span></span>';
    html += '</div>';

    html += '<ul class="children">';
    if (node["children"]) {
        for (const child of node["children"]) {
            html += '<li>' + nodeToHtml(child, totalTime) + '</li>';
        }
    }
    html += '</ul>';

    html += '</div>';
    return html;
}

function loadData(data) {
    let html;
    if (!data["threads"]) {
        html = '<p class="no-results">There are no results. (Thread filter does not match thread?)</p>';
    } else {
        html = "";
        for (const thread of data["threads"]) {
            html += nodeToHtml(thread["rootNode"], thread["totalTime"]);
            html += '\n';
        }
    }

    const stack = $(".stack");
    const loading = $(".loading");

    stack.html(html);
    loading.hide();
    stack.show();

    setupListeners();
}

// Do things when page has loaded
$(loadContent);

function extractTime(el) {
    const text = el.children(".name").children(".time").text().replace(/[^0-9]/, "");
    return parseInt(text);
}

// sets up the page listeners
function setupListeners() {
    const nameClass = $(".name");
    const overlay = $("#overlay");

    nameClass.on("click", function(e) {
        const parent = $(this).parent();
        if (parent.hasClass("collapsed")) {
            parent.removeClass("collapsed");
            parent.children("ul").slideDown(50);
        } else {
            parent.addClass("collapsed");
            parent.children("ul").slideUp(50);
        }
    });

    nameClass.on("mouseenter", function(e) {
        const $this = $(this);
        let thisTime = null;

        overlay.empty();

        $this.parents(".node").each(function(i, parent) {
            const $parent = $(parent);
            const time = extractTime($parent);

            if (thisTime == null) {
                thisTime = time;
            } else {
                const $el = $(document.createElement("span"));
                const pos = $parent.position();
                $el.text(((thisTime / time) * 100).toFixed(2) + "%");
                $el.css({
                    top: pos.top + "px"
                });
                overlay.append($el);
            }
        });
    });
}