let activeData;

const $stack = $("#stack");
const $overlay = $("#overlay");
const $loading = $("#loading");
const $sampler = $("#sampler");

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
    if (!data["threads"] || !data["threads"].length) {
        html = '<p class="no-results">There are no results. (Thread filter does not match thread?)</p>';
    } else {
        html = "";
        for (const thread of data["threads"]) {
            const threadNode = thread["rootNode"] || thread;
            html += renderStackToHtml(threadNode, threadNode["time"], renderingFunction);
            html += '\n';
        }
    }

    $stack.html(html);
    $loading.hide();
    $sampler.show();
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
            const timePercent = ((node["time"] / totalTime) * 100).toFixed(2) + "%";
            html += '<li>';
            html += '<div class="node collapsed" data-name="' + simpleRender(node, parentNode) + '">';
            html += '<div class="name">';
            html += renderingFunction(node, parentNode);
            const parentLineNumber = node["lineNumber"];
            if (parentLineNumber) {
                html += '<span class="lineNumber" title="Invoked on line ' + parentLineNumber + ' of ' + parentNode["methodName"] + '()">:' + parentLineNumber + '</span>';
            }
            html += '<span class="percent">' + timePercent + '</span>';
            html += '<span class="time">' + node["time"] + 'ms</span>';
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

/**
 * Does the remapping work for the Yarn rendering function.
 *
 * @param node the node
 * @param yarnMappings yarn mapping data
 * @returns {string}
 */
function doYarnRemapping(node, yarnMappings) {
    // extract class and method names from the node
    const className = node["className"];
    const methodName = node["methodName"];
    if (!className || !methodName) {
        return escapeHtml(node["name"]);
    }

    const yarnClassName = yarnMappings["classes"][className];
    const yarnMethodName = yarnMappings["methods"][methodName];

    let out = "";

    if (yarnClassName && typeof(yarnClassName) === "string") {
        out += '<span class="remapped" title="' + className + '">' + escapeHtml(yarnClassName) + '</span>';
    } else {
        out += escapeHtml(className);
    }
    out += ".";
    if (yarnMethodName && typeof(yarnMethodName) === "string") {
        out += '<span class="remapped" title="' + methodName + '">' + escapeHtml(yarnMethodName) + '</span>';
    } else {
        out += escapeHtml(methodName);
    }

    return out + "()";
}

function applyRemapping(type) {
    $sampler.hide();
    $overlay.empty();
    $loading.show().html("Remapping data; please wait...");
    if (type.startsWith("bukkit")) {
        const version = type.substring("bukkit-".length);
        const nmsVersion = {
            "1_15": "v1_15_R1"
            "1_14_4": "v1_14_R1",
            "1_13_2": "v1_13_R2",
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
    } else if (type.startsWith("yarn")) {
        const version = type.substring("yarn-".length);

        $.getJSON("mappingdata/" + version + "/yarn.json", function(yarnMappings) {
            const renderingFunction = function(node, parentNode) {
                return doYarnRemapping(node, yarnMappings);
            };

            renderData(activeData, renderingFunction)
        });
    } else {
        setTimeout(function() {
            renderData(activeData, simpleRender);
        }, 0);
    }
}

function applyFilters(filter) {
    $sampler.hide();
    $overlay.empty();
    $loading.show().html("Applying filter; please wait...");

    setTimeout(function() {
        const stacks = $("#stack > .node");
        for (const stack of stacks) {
            applyFilter(filter, $(stack));
        }
        $sampler.show();
        $loading.hide();
    }, 0);
}

function applyFilter(filter, element) {
    // element is a div, with class "node"
    const children = element.children("ul").children("li").children(".node");

    // check if "this" element should be shown.
    let show = filter === null || element.attr("data-name").toLowerCase().includes(filter.toLowerCase());

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


/*
 * Define page listeners.
 * These will be evaluated before any content has actually been rendered and added to the page.
 */

// utility functions for manipulating the stack view.
function expandTree(parent) {
    parent.removeClass("collapsed");
    const list = parent.children("ul");
    list.slideDown(50);

    // if the element we've just expanded only has one child, expand that too (recursively)
    const children = list.children("li");
    if (children.length === 1) {
        const onlyChild = children.children(".node");
        expandTree(onlyChild); // recursive call
    }
}
function expandEntireTree(node) {
    node.find("ul").show();
    node.find(".node").addBack().removeClass("collapsed");
}
function collapseEntireTree(node) {
    node.find("ul").hide();
    node.find(".node").addBack().addClass("collapsed");
    $overlay.empty();
}
function expandAll() {
    expandEntireTree($stack);
}
function collapseAll() {
    collapseEntireTree($stack);
}

// click node --> expand/collapse
$stack.on("click", ".name", function(e) {
    const parent = $(this).parent();
    if (parent.hasClass("collapsed")) {
        expandTree(parent);
    } else {
        parent.addClass("collapsed");
        parent.children("ul").slideUp(50);
    }
});

// hover over node --> highlight and show time
$stack.on("mouseenter", ".name", function(e) {
    // ignore hover changes when the context menu is active
    if (contextMenuActive()) {
        return;
    }

    // mark the current element as hovered
    $(this).addClass("hovered");

    // clear the overlay
    $overlay.empty();

    // render updated overlay
    let totalTime = null;
    $(this).parents(".node").each(function(i, element) {
        const parent = $(element);
        const time = parseInt(parent.children(".name").children(".time").text().replace(/[^0-9]/, ""));
        
        if (totalTime == null) {
            totalTime = time;
        } else {
            const span = $(document.createElement("span"));
            const pos = parent.position();
            span.text(((totalTime / time) * 100).toFixed(2) + "%");
            span.css({
                top: pos.top + "px"
            });
            $overlay.append(span);
        }
    });
});
$stack.on("mouseleave", ".name", function(e) {
    // if the parent node is the context menu target, don't remove the hover yet.
    if (this.parentNode === contextMenuTarget) {
        return;
    }
    $(this).removeClass("hovered");
});

// context menu handling
const contextMenu = $("#stack-context-menu");
let contextMenuTarget;

function hideContextMenu() {
    if (contextMenuActive()) {
        contextMenu.hide();
        $(contextMenuTarget).children(".name").removeClass("hovered");
        contextMenuTarget = null;
        return true;
    }
    return false;
}

function contextMenuActive() {
    return contextMenu.css("display") !== "none";
}

// listen for context menu open
$stack.contextmenu(function(e) {
    // if the context menu is already open, close it & return.
    if (hideContextMenu()) {
        e.preventDefault();
        return;
    }

    // determine the target of the context menu
    contextMenuTarget = $(e.target).closest(".node");
    contextMenuTarget.addClass("hovered");
    contextMenuTarget = contextMenuTarget.get()[0];

    // if no target was found, return
    if (!contextMenuTarget) {
        return;
    }
    
    // cancel the default action & render our custom menu
    e.preventDefault();
    contextMenu.css({
        left: `${e.pageX}px`,
        top: `${e.pageY}px`
    });
    contextMenu.toggle(300);
});
// handle click events within the context menu
contextMenu.click(function(e) {
    const target = $(e.target);
    const action = target.attr("data-action");
    if (action === "expand") {
        expandEntireTree($(contextMenuTarget));
    } else if (action === "collapse") {
        collapseEntireTree($(contextMenuTarget));
    } else if (action === "expand-all") {
        expandAll();
    } else if (action === "collapse-all") {
        collapseAll();
    }
});
// close the menu when the cursor is clicked elsewhere.
$(window).click(function(e) {
    hideContextMenu();
});
// close the menu when the escape key is pressed.
$(document).keyup(function(e) {
    if (e.key === "Escape") {
        hideContextMenu();
    }
});

// listen for mapping selections
$("#mappings-selector > select").change(function(e) {
    applyRemapping(this.value);
});

// listen for filter box submissions
$("#sampler > .filter-input-box").keyup(function(e) {
    if (e.keyCode === 13) {
        let value = this.value;
        if (value === "") {
            value = null;
        }
        applyFilters(value);
    }
});
