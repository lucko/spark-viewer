The `.proto` file is compiled to Javascript using:

```bash
sudo npm install -g pbf
pbf spark.proto --no-write >> protos.js
```

Resultant JavaScript file is `protos.js`.

Note that field names in the `.proto` file have been changed to `camelCase` (this is [considered bad style](https://developers.google.com/protocol-buffers/docs/style#message-and-field-names)) to create variable names in JavaScript which are also camel case.
