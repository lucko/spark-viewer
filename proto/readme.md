The .proto files are compiled to Javascript using:

```bash
sudo npm install protobufjs
sudo npm install -g browserify

pbjs -t static-module -w commonjs -o proto-module.js spark.proto
browserify ./proto-module.js -o protos.js
```

Resultant JavaScript file is `protos.js`.

We then make one small change to this file to expose the protobuf object in the global scope.

![](https://i.imgur.com/ntj2utA.png)