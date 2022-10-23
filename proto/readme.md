The `.proto` file is compiled to Typescript using:

```bash
yarn proto
```

and the resultant TS file is output in `src/proto/spark_pb.ts`.

Note that field names in the `.proto` file have been changed to `camelCase` (this is [considered bad style](https://developers.google.com/protocol-buffers/docs/style#message-and-field-names)) to create variable names which are also camel case.
