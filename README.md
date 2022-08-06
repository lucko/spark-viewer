![](https://i.imgur.com/ykHn9vx.png)

# spark-viewer

[spark](https://github.com/lucko/spark) is a performance profiling plugin/mod for Minecraft clients, servers, and proxies.

This repository contains the website & viewer for spark, written using [React](https://reactjs.org).

The website contains:

-   a brief **homepage**
-   **downloads** page which serves direct links to the latest release
-   **documentation**, although this is managed in a [separate repository](https://github.com/lucko/spark-docs)
-   a **viewer** web-app for spark data, which has modes for:
    -   viewing the output from the spark **profiler**
    -   viewing the output from spark **heap dump** summaries

### Viewer

The viewer component of the website reads data from [bytebin](https://github.com/lucko/bytebin), a separate service for content storage, then renders this data client-side as an interactive viewer in which the user can interpret and analyse their results.

The profile viewer renders the data as an expandable call stack tree, with support for applying deobfuscation mappings, searching, bookmarks and viewing as a flame graph.

The heap dump summary viewer renders a histogram of the classes occupying the most memory at the time when the data was collected.

### Contributions

Yes please! - but please open an issue or ping me on [Discord](https://discord.gg/PAGT2fu) (so we can discuss your idea) before working on a big change!

### License

spark is free & open source. It is released under the terms of the GNU GPLv3 license. Please see [`LICENSE.txt`](LICENSE.txt) for more information.

spark is a fork of [WarmRoast](https://github.com/sk89q/WarmRoast), which was also [licensed using the GPLv3](https://github.com/sk89q/WarmRoast/blob/3fe5e5517b1c529d95cf9f43fd8420c66db0092a/src/main/java/com/sk89q/warmroast/WarmRoast.java#L1-L17).
