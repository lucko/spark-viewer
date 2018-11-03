# spark-web
This repository contains the web frontend for the [spark](https://github.com/lucko/spark) plugin.

The site is merely a single static web page. Content storage is handled separately, and page rendering & interactivity is implemented using JavaScript (& jQuery). Data is transferred from the plugin using a separate hosting service, which acts as a middle man. An "id" is provided as a query param / fragment identifier in the URL to indicate the storage key of the data. The content is then loaded via an AJAX request.

The stateless nature of the site means it can be hosted using GitHub Pages, or just from a folder on your Desktop, which is kinda neat.

A production branch can be found at [sparkprofiler/sparkprofiler.github.io](https://github.com/sparkprofiler/sparkprofiler.github.io), which publishes using GitHub Pages at [https://sparkprofiler.github.io/](https://sparkprofiler.github.io/).

### Contributions
Yes please - but please open an issue or ping me on [Discord](https://discord.gg/PAGT2fu) (so we can discuss ideas) before working on a big change!

### License
GPLv3 - Since much of the project is based on [WarmRoast](https://github.com/sk89q/WarmRoast), we [inherit it's license](https://github.com/sk89q/WarmRoast/blob/3fe5e5517b1c529d95cf9f43fd8420c66db0092a/src/main/java/com/sk89q/warmroast/WarmRoast.java#L1-L17).
