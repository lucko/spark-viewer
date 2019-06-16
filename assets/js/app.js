const BYTEBIN_URL = "https://bytebin.lucko.me/";
let type;

function getType(typeName) {
    return {
        "sampler": {
            legacyKeys: {
                c: "children",
                t: "time",
                cl: "className",
                m: "methodName",
                ln: "lineNumber"
            },
            load: function(data) {
                $.getScript("assets/js/types/sampler.js", function() {
                    loadSampleData(data);
                });
            }
        },
        "heap": {
            legacyKeys: {
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

function createLegacyRemappingFunction() {
    const newKeys = type.legacyKeys;
    return function(key, value) {
        if (typeof value === "object" && !Array.isArray(value)) {
            const keyValues = Object.keys(value).map(key => {
                const newKey = newKeys[key] || key;
                return {[newKey]: value[key]};
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
        const $loading = $("#loading");
        $loading.show().html("Loading data; please wait...");

        // get data
        const url = BYTEBIN_URL + params;
        console.log("Loading from URL: " + url);

        const req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";
        req.onload = function(event) {
            $loading.html("Rendering data; please wait...");

            if (req.status >= 400) {
                showLoadingError();
                return;
            }

            const contentType = req.getResponseHeader("Content-Type");
            const buf = req.response;

            if (contentType === "application/x-spark-sampler") {
                const SamplerData = proto.roots.default.spark.SamplerData;
                const data = SamplerData.decode(new Uint8Array(buf));

                type = getType("sampler");
                type.load(data);
            } else if (contentType === "application/x-spark-heap") {
                const HeapData = proto.roots.default.spark.HeapData;
                const data = HeapData.decode(new Uint8Array(buf));

                type = getType("heap");
                type.load(data);
            } else {
                const raw = new TextDecoder("utf-8").decode(buf);
                // we have to parse the data twice, first without any remapping to determine the type,
                // and then again with remapping, once we know which rules to use.
                type = getType(JSON.parse(raw)["type"] || "sampler");
                const data = JSON.parse(raw, createLegacyRemappingFunction());
                type.load(data);
            }
        };
        req.onerror = showLoadingError;
        req.send();
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
