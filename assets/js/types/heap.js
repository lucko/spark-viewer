/**
 * Called by the application to initialise the heap view.
 *
 * @param data the json data to be viewed.
 */
function loadHeapData(data) {
    let content = "";
    content += '<table style="border-spacing: 20px 0;">';
    content += '<tr>';
    for (const col of ["#", "Instances", "Bytes", "Type"]) {
        content += '<th style="text-align: left">' + col + '</th>';
    }
    content += '</tr>';

    for (const entry of data["entries"]) {
        content += '<tr>';
        content += '<td>#' + entry["order"] + '</td>';
        content += '<td>' + entry["instances"] + '</td>';
        content += '<td>' + entry["size"] + '</td>';
        content += '<td>' + entry["type"] + '</td>';
        content += '</tr>';
    }

    content += '</table>';

    const heap = $(".heap");
    const loading = $(".loading");

    heap.html(content);
    loading.hide();
    heap.show();
}
