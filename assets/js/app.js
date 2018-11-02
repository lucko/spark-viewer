const BYTEBIN_URL = "https://bytebin.lucko.me/";
let type;

function determineType(typeName) {
    return {
        "sampler": {
            shorthandKeys: {
                c: "children",
                t: "totalTime",
                cl: "className",
                m: "methodName",
                ln: "parentLineNumber"
            },

            load: function(data) {
                $.getScript("assets/js/types/sampler.js", function() {
                    loadSampleData(data);
                });
            }
        },
        "heap": {
            shorthandKeys: {
                "#": "order",
                i: "instances",
                s: "size",
                t: "type"
            },

            load: function(data) {
                $.getScript("assets/js/types/heap.js", function() {
                    loadHeapData(data);
                });
            }
        }
    }[typeName];
}

function createRemappingFunction() {
    const newKeys = type.shorthandKeys;
    return function(key, value) {
        if (typeof value === "object" && !Array.isArray(value)) {
            const keyValues = Object.keys(value).map(key => {
                const newKey = newKeys[key] || key;
                return { [newKey]: value[key] };
            });
            return Object.assign({}, ...keyValues);
        }
        return value;
    }
}

// try to load the page from the url parameters when the page loads
function loadContent() {
    let params = document.location.search || window.location.hash;
    if (params) {
        if (params.startsWith("?") || params.startsWith("#")) {
            params = params.substring(1);
        }

        $("#intro").hide();
        $("#loading").show().html("Loading data; please wait...");

        // get data
        const url = BYTEBIN_URL + params;
        console.log("Loading from URL: " + url);

        $.ajax({
            dataType: "text",
            url: url,
            success: function(raw) {
                // we have to parse the data twice, first without any remapping to determine the type,
                // and then again with remapping, once we know which rules to use.
                type = determineType(JSON.parse(raw)["type"] || "sampler");
                const data = JSON.parse(raw, createRemappingFunction());

                type.load(data);
            }
        }).fail(showLoadingError);
    }
}

function showLoadingError() {
    $("#loading").html("An error occurred whilst loading. Perhaps the data has expired?");
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

// Do things when page has loaded
$(loadContent);
