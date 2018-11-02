let activeData;

/**
 * Called by the application to initialise the heap view.
 *
 * @param data the json data to be viewed.
 */
function loadHeapData(data) {
    renderData(data, null);

    // store so we can re-use later, if filtering is applied, for example.
    activeData = data;
}

function applyFilter(filter) {
    $("#heap").hide();
    $("#loading").show().html("Applying filter; please wait...");

    setTimeout(function() {
        renderData(activeData, filter);
    }, 0);
}

function renderData(data, filter) {
    let content = "";

    // dynamic content
    content += '<table style="border-spacing: 20px 0;">';
    content += '<tr>';
    for (const col of ["Rank", "Instances", "Size", "Type"]) {
        content += '<th style="text-align: left">' + col + '</th>';
    }
    content += '</tr>';

    let totalInstances = 0;
    let totalSize = 0;

    let tableEntries = "";
    for (const entry of data["entries"]) {
        if (filter !== null && !entry["type"].includes(filter)) {
            continue;
        }

        const instances = parseInt(entry["instances"]);
        const size = parseInt(entry["size"]);

        totalInstances += instances;
        totalSize += size;

        tableEntries += '<tr>';
        tableEntries += '<td>#' + entry["order"] + '</td>';
        tableEntries += '<td>' + instances.toLocaleString() + '</td>';
        tableEntries += '<td>' + formatBytes(size) + '</td>';
        tableEntries += '<td>' + entry["type"] + '</td>';
        tableEntries += '</tr>';
    }

    content += '<tr><td>Total</td><td>' + totalInstances.toLocaleString() + '</td><td>' + formatBytes(totalSize) + '</td><td>n/a</td></tr>';
    content += '<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>'; // blank line.
    content += tableEntries;
    content += '</table>';

    const heap = $("#heap");
    const heapContent = $("#heap-content");
    const loading = $("#loading");

    heapContent.html(content);
    loading.hide();
    heap.show();
}

function formatBytes(bytes) {
    if (bytes === 0) {
        return "0 bytes";
    }
    const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, sizeIndex)).toFixed(2)) + " " + sizes[sizeIndex];
}

$("#heap > .filter-input-box").keyup(function(e) {
    if (e.keyCode === 13) {
        let value = $(this).val();
        if (value === "") {
            value = null;
        }
        applyFilter(value);
    }
});