let activeData;

/**
 * Called by the application to initialise the sampler view.
 *
 * @param data the json data to be viewed.
 */
function loadSampleData(data) {
    renderData(data, simpleRender);
    $("#mappings-selector").show();

    // store so we can re-use later, if remapping is applied, for example.
    activeData = data;
}

/**
 * Main function to load "sampler" data.
 *
 * @param data the json data to be viewed.
 * @param renderingFunction the function to be used to represent sampler entries.
 *        a rendering function can be described as:
 *        (JS Object rep. of node, JSObject rep. of the parentNode, nullable) --> HTML representation of "node" as a string.
 */
function renderData(data, renderingFunction) {
    let html;
    if (!data["threads"]) {
        html = '<p class="no-results">There are no results. (Thread filter does not match thread?)</p>';
    } else {
        html = "";
        for (const thread of data["threads"]) {
            html += renderStackToHtml(thread["rootNode"], thread["totalTime"], renderingFunction);
            html += '\n';
        }
    }

    $("#stack").html(html);
    $("#loading").hide();
    $("#sampler").show();
}

/**
 * Function to render the sampled data to html.
 *
 * @param root the root of the sample stack
 * @param totalTime the total time taken by all nodes
 * @param renderingFunction the function used for rendering nodes
 * @returns {string} the html
 */
function renderStackToHtml(root, totalTime, renderingFunction) {
    let html = "";

    // init a new stack, and push the root element
    let stack = [{
        node: root,
        parentNode: null,
        status: "start"
    }];

    // perform a iterative traversal of the call stack
    while (stack.length !== 0) {
        const element = stack.pop();
        const status = element.status;

        if (status === "start") {
            const node = element.node;
            const parentNode = element.parentNode;

            // push a marker to "end" this node
            stack.push({
                status: "end"
            });

            // push this nodes children in reverse
            if (node["children"]) {
                for (const child of node.children.slice().reverse()) {
                    stack.push({
                        node: child,
                        parentNode: node,
                        status: "start"
                    });
                }
            }

            // print start
            const timePercent = ((node["totalTime"] / totalTime) * 100).toFixed(2) + "%";
            html += '<li>';
            html += '<div class="node collapsed" data-name="' + simpleRender(node, parentNode) + '">';
            html += '<div class="name">';
            html += renderingFunction(node, parentNode);
            html += '<span class="percent">' + timePercent + '</span>';
            html += '<span class="time">' + node["totalTime"] + 'ms</span>';
            html += '<span class="bar"><span class="bar-inner" style="width: ' + timePercent + '"></span></span>';
            html += '</div>';
            html += '<ul class="children">';
        } else {
            // print end
            html += '</ul>';
            html += '</div>';
            html += '</li>';
        }
    }

    // remove outer the <li> </li>
    return html.slice(4, -5);
}

/**
 * A render function that doesn't do any remapping!
 *
 * @param node
 * @param parentNode
 * @returns {string}
 */
function simpleRender(node, parentNode) {
    // extract class and method names from the node
    const className = node["className"];
    const methodName = node["methodName"];
    if (!className || !methodName) {
        return escapeHtml(node["name"]);
    }

    return escapeHtml(className) + '.' + escapeHtml(methodName) + '()';
}

/**
 * Does the remapping work for the Bukkit rendering function.
 *
 * @param node the node
 * @param parentNode the parent node
 * @param mcpMappings mcp mapping data
 * @param bukkitMappings bukkit mapping data
 * @param methodCalls method call data
 * @param nmsVersion the nms version used
 * @returns {string}
 */
function doBukkitRemapping(node, parentNode, mcpMappings, bukkitMappings, methodCalls, nmsVersion) {
    // extract class and method names from the node
    const className = node["className"];
    const methodName = node["methodName"];
    if (!className || !methodName) {
        return escapeHtml(node["name"]);
    }

    const name = escapeHtml(className) + '.' + escapeHtml(methodName) + '()';

    // only remap nms classes
    if (!className.startsWith("net.minecraft.server." + nmsVersion + ".")) {
        return name;
    }

    // get the nms name of the class
    const nmsClassName = className.substring(("net.minecraft.server." + nmsVersion + ".").length);

    // try to find bukkit mapping data for the class
    let bukkitMappingData = bukkitMappings["classes"][nmsClassName];
    if (nmsClassName === "MinecraftServer") {
        bukkitMappingData = bukkitMappings["classes"]["net.minecraft.server.MinecraftServer"];
    }

    if (!bukkitMappingData) {
        return name;
    }

    // get the obfuscated name of the class
    const obfuscatedClassName = bukkitMappingData["obfuscated"];

    // try to obtain mcp mappings for the now obfuscated class
    const mcpData = mcpMappings["classes"][obfuscatedClassName];
    if (!mcpData) {
        return name;
    }

    // we have a mcp name for the class
    // now attempt to remap the method

    // if bukkit has already provided a mapping for this method, just return.
    for (const method of bukkitMappingData["methods"]) {
        if (method["bukkitName"] === methodName) {
            return name;
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

    return name;
}

/**
 * Does the remapping work for the MCP rendering function.
 *
 * @param node the node
 * @param mcpMappings mcp mapping data
 * @returns {string}
 */
function doMcpRemapping(node, mcpMappings) {
    // extract class and method names from the node
    const className = node["className"];
    const methodName = node["methodName"];
    if (!className || !methodName) {
        return escapeHtml(node["name"]);
    }

    const mcpMethodName = mcpMappings["methods"][methodName];
    if (mcpMethodName && $.type(mcpMethodName) === "string") {
        return escapeHtml(className) + '.<span class="remapped" title="' + methodName + '">' + escapeHtml(mcpMethodName) + '</span>()';
    }

    return escapeHtml(className) + '.' + escapeHtml(methodName) + '()';
}

// listen for mapping selections
$("#mappings-selector").find("select").change(function(e) {
    applyRemapping(this.value);
});

function applyRemapping(type) {
    $("#sampler").hide();
    $("#loading").show().html("Remapping data; please wait...");
    if (type.startsWith("bukkit")) {
        const version = type.substring("bukkit-".length);
        const nmsVersion = {
            "1_13_1": "v1_13_R2",
            "1_13": "v1_13_R1",
            "1_12_2": "v1_12_R1",
            "1_11_2": "v1_11_R1",
            "1_10_2": "v1_10_R1",
            "1_8_8": "v1_8_R3"
        }[version];

        $.getJSON("mappingdata/" + version + "/mcp.json", function(mcpMappings) {
            $.getJSON("mappingdata/" + version + "/bukkit.json", function(bukkitMappings) {
                $.getJSON("mappingdata/" + version + "/methodcalls.json", function(methodCalls) {
                    const renderingFunction = function(node, parentNode) {
                        return doBukkitRemapping(node, parentNode, mcpMappings, bukkitMappings, methodCalls, nmsVersion);
                    };

                    renderData(activeData, renderingFunction)
                });
            });
        });
    } else if (type.startsWith("mcp")) {
        const version = type.substring("mcp-".length);

        $.getJSON("mappingdata/" + version + "/mcp.json", function(mcpMappings) {
            const renderingFunction = function(node, parentNode) {
                return doMcpRemapping(node, mcpMappings);
            };

            renderData(activeData, renderingFunction)
        });
    } else {
        setTimeout(function() {
            renderData(activeData, simpleRender);
        }, 0);
    }
}

/*
 * Define page listeners.
 * These will be evaluated before any content has actually been rendered and added to the page.
 */

const stack = $("#stack");
const overlay = $("#overlay");

/**
 * Function to recursively expand the node tree.
 *
 * @param parent the parent element
 */
function expandTree(parent) {
    parent.removeClass("collapsed");
    parent.children("ul").slideDown(50);

    // if the element we've just expanded only has one child, expand that too (recursively)
    const len = parent.children("ul").children("li").length;
    if (len === 1) {
        const onlyChild = parent.children("ul").children("li").children(".node");
        if (onlyChild.hasClass("collapsed")) {
            expandTree(onlyChild); // recursive call
        }
    }
}

// click node --> expand/collapse
stack.on("click", ".name", function(e) {
    const parent = $(this).parent();
    if (parent.hasClass("collapsed")) {
        expandTree(parent);
    } else {
        parent.addClass("collapsed");
        parent.children("ul").slideUp(50);
    }
});

// hover over node --> highlight and show time
stack.on("mouseenter", ".name", function(e) {
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

$("#sampler > .filter-input-box").keyup(function(e) {
    if (e.keyCode === 13) {
        let value = $(this).val();
        if (value === "") {
            value = null;
        }
        applyFilters(value);
    }
});

function extractTime(el) {
    const text = el.children(".name").children(".time").text().replace(/[^0-9]/, "");
    return parseInt(text);
}

function applyFilters(filter) {
    $("#sampler").hide();
    $("#loading").show().html("Applying filter; please wait...");

    setTimeout(function() {
        const stacks = $("#stack > .node");
        for (const stack of stacks) {
            applyFilter(filter, $(stack));
        }
        $("#sampler").show();
        $("#loading").hide();
    }, 0);
}

function applyFilter(filter, element) {
    // element is a div, with class "node"
    const children = element.children("ul").children("li").children(".node");

    // check if "this" element should be shown.
    let show = filter === null || element.attr("data-name").includes(filter);

    if (show) {
        // if this element should be shown, pass that onto all children & make them shown.
        for (const child of children) {
            applyFilter(null, $(child));
        }
    } else {
        // check to see if any of our children match the filter
        for (const child of children) {
            if (applyFilter(filter, $(child))) {
                show = true;
            }
        }
    }

    // show the element if necessary.
    let parent = element.parent();
    if (parent.attr("id") === "stack") {
        parent = element;
    }
    if (show) {
        parent.show();
    } else {
        parent.hide();
    }

    return show;
}
