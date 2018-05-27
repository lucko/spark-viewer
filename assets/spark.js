let profile;


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

        $.getJSON(url, function(data) {
            profile = data;
            loadData(data, NO_REMAPPING);
        }).fail(showLoadingError)
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

function nodeToHtml(node, parentNode, totalTime, remappingFunction) {
    const timePercent = ((node["totalTime"] / totalTime) * 100).toFixed(2) + "%";
    let html = "";

    html += '<div class="node collapsed">';

    html += '<div class="name">';
    html += remappingFunction(node, parentNode);
    html += '<span class="percent">' + timePercent + '</span>';
    html += '<span class="time">' + node["totalTime"] + 'ms</span>';
    html += '<span class="bar"><span class="bar-inner" style="width: ' + timePercent + '"></span></span>';
    html += '</div>';

    html += '<ul class="children">';
    if (node["children"]) {
        for (const child of node["children"]) {
            html += '<li>' + nodeToHtml(child, node, totalTime, remappingFunction) + '</li>';
        }
    }
    html += '</ul>';

    html += '</div>';
    return html;
}

const NO_REMAPPING = function(node, parentNode) {
    return escapeHtml(node["name"]);
};

function loadData(data, remappingFunction) {
    let html;
    if (!data["threads"]) {
        html = '<p class="no-results">There are no results. (Thread filter does not match thread?)</p>';
    } else {
        html = "";
        for (const thread of data["threads"]) {
            html += nodeToHtml(thread["rootNode"], null, thread["totalTime"], remappingFunction);
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

const bukkitRemappingFunction = function (node, parentNode, mcpMappings, bukkitMappings, methodCalls, nmsVersion) {
    const name = node["name"];

    // extract class and method names from the node
    const className = node["className"];
    const methodName = node["methodName"];
    if (!className || !methodName) {
        return escapeHtml(name);
    }

    // only remap nms classes
    if (!className.startsWith("net.minecraft.server." + nmsVersion + ".")) {
        return escapeHtml(name);
    }

    // get the nms name of the class
    const nmsClassName = className.substring(("net.minecraft.server." + nmsVersion + ".").length);

    // try to find bukkit mapping data for the class
    let bukkitMappingData = bukkitMappings["classes"][nmsClassName];
    if (nmsClassName === "MinecraftServer") {
        bukkitMappingData = bukkitMappings["classes"]["net.minecraft.server.MinecraftServer"];
    }

    if (!bukkitMappingData) {
        return escapeHtml(name);
    }

    // get the obfuscated name of the class
    const obfuscatedClassName = bukkitMappingData["obfuscated"];

    // try to obtain mcp mappings for the now obfuscated class
    const mcpData = mcpMappings["classes"][obfuscatedClassName];
    if (!mcpData) {
        return escapeHtml(name);
    }

    // we have a mcp name for the class
    // now attempt to remap the method

    // if bukkit has already provided a mapping for this method, just return.
    for (const method of bukkitMappingData["methods"]) {
        if (method["bukkitName"] === methodName) {
            return escapeHtml(name);
        }
    }

    // attempt to determine the method name
    let otherMatches = [];
    for (const other of mcpData["methods"]) {
        if (other["obfuscated"] === methodName) {
            otherMatches.push(other);
        }
    }

    if (otherMatches.length === 1) {
        // we got lucky ;>
        const mappedMethodName = otherMatches[0]["mcpName"];

        if (mappedMethodName !== methodName) {
            console.log("[MAPPING] Mapped " + name + " --> " + className + "." + mappedMethodName + "()");
        }

        return escapeHtml(className) + '.<span class="remapped" title="' + methodName + '">' + escapeHtml(mappedMethodName) + '</span>()';
    }

    // try to infer which method was called
    if (otherMatches.length > 1 && parentNode && parentNode["className"] && parentNode["methodName"]) {
        const parentClass = parentNode["className"];
        const parentMethod = parentNode["methodName"];

        let parentClassMethods = methodCalls["outgoingMethodCalls"][parentClass];
        if (!parentClassMethods) {
            parentClassMethods = {};
        }
        const outgoingCalls = parentClassMethods[parentMethod];
        if (outgoingCalls) {
            for (const call of outgoingCalls) {
                if (call["class"] === className) {
                    for (const otherMatch of otherMatches) {
                        if (call["description"] === otherMatch["description"]) {
                            const mappedMethodName = otherMatch["mcpName"];
                            if (mappedMethodName !== methodName) {
                                console.log("[MAPPING] Mapped " + name + " --> " + className + "." + mappedMethodName + "()");
                            }
                            return escapeHtml(className) + '.<span class="remapped" title="' + methodName + '">' + escapeHtml(mappedMethodName) + '</span>()';
                        }
                    }
                }
            }
        }
    }

    // maybe just some with the same name?
    const otherMatchesNames = otherMatches.map(function(e) { return e["mcpName"] });
    const otherUniqueMatches = otherMatchesNames.filter(function(item, pos) {
        return otherMatchesNames.indexOf(item) === pos;
    });

    if (otherUniqueMatches.length === 1 || otherUniqueMatches.length === 2) {
        let mappedMethodName;
        if (otherUniqueMatches.length === 1) {
            mappedMethodName = otherUniqueMatches[0];
        } else {
            mappedMethodName = otherUniqueMatches[0] + " or " + otherUniqueMatches[1];
        }

        if (mappedMethodName !== methodName) {
            console.log("[MAPPING] Mapped " + name + " --> " + className + "." + mappedMethodName + "()");
        }

        return escapeHtml(className) + '.<span class="remapped" title="' + methodName + '">' + escapeHtml(mappedMethodName) + '</span>()';
    }

    return escapeHtml(name);
};

// listen for mapping selections
$("#mappings-selector").find("select").change(function(e) {
    applyRemapping(this.value);
});

function applyRemapping(type) {
    if (type.startsWith("bukkit")) {
        const version = type.substring("bukkit-".length);
        let nmsVersion;
        if (version === "1_12_2") {
            nmsVersion = "v1_12_R1";
        }
        if (version === "1_8_8") {
            nmsVersion = "v1_8_R3";
        }

        $(".stack").hide();
        $(".loading").show().html("Remapping data; please wait...");

        $.getJSON("mappingdata/" + version + "/mcp.json", function(mcpMappings) {
            $.getJSON("mappingdata/" + version + "/bukkit.json", function(bukkitMappings) {
                $.getJSON("mappingdata/" + version + "/methodcalls.json", function(methodCalls) {
                    const remappingFunction = function(node, parentNode) {
                        return bukkitRemappingFunction(node, parentNode, mcpMappings, bukkitMappings, methodCalls, nmsVersion);
                    };

                    loadData(profile, remappingFunction)
                });
            });
        });
    }
}