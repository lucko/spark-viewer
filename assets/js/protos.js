var protos;

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
        /*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
        "use strict";

        var $protobuf = require("protobufjs/minimal");
        protos = $protobuf;

// Common aliases
        var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
        var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

        $root.spark = (function() {

            /**
             * Namespace spark.
             * @exports spark
             * @namespace
             */
            var spark = {};

            spark.CommandSenderData = (function() {

                /**
                 * Properties of a CommandSenderData.
                 * @memberof spark
                 * @interface ICommandSenderData
                 * @property {spark.CommandSenderData.Type|null} [type] CommandSenderData type
                 * @property {string|null} [name] CommandSenderData name
                 * @property {string|null} [uniqueId] CommandSenderData uniqueId
                 */

                /**
                 * Constructs a new CommandSenderData.
                 * @memberof spark
                 * @classdesc Represents a CommandSenderData.
                 * @implements ICommandSenderData
                 * @constructor
                 * @param {spark.ICommandSenderData=} [properties] Properties to set
                 */
                function CommandSenderData(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * CommandSenderData type.
                 * @member {spark.CommandSenderData.Type} type
                 * @memberof spark.CommandSenderData
                 * @instance
                 */
                CommandSenderData.prototype.type = 0;

                /**
                 * CommandSenderData name.
                 * @member {string} name
                 * @memberof spark.CommandSenderData
                 * @instance
                 */
                CommandSenderData.prototype.name = "";

                /**
                 * CommandSenderData uniqueId.
                 * @member {string} uniqueId
                 * @memberof spark.CommandSenderData
                 * @instance
                 */
                CommandSenderData.prototype.uniqueId = "";

                /**
                 * Creates a new CommandSenderData instance using the specified properties.
                 * @function create
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {spark.ICommandSenderData=} [properties] Properties to set
                 * @returns {spark.CommandSenderData} CommandSenderData instance
                 */
                CommandSenderData.create = function create(properties) {
                    return new CommandSenderData(properties);
                };

                /**
                 * Encodes the specified CommandSenderData message. Does not implicitly {@link spark.CommandSenderData.verify|verify} messages.
                 * @function encode
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {spark.ICommandSenderData} message CommandSenderData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CommandSenderData.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.type != null && message.hasOwnProperty("type"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.uniqueId != null && message.hasOwnProperty("uniqueId"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.uniqueId);
                    return writer;
                };

                /**
                 * Encodes the specified CommandSenderData message, length delimited. Does not implicitly {@link spark.CommandSenderData.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {spark.ICommandSenderData} message CommandSenderData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CommandSenderData.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a CommandSenderData message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.CommandSenderData} CommandSenderData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CommandSenderData.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.CommandSenderData();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.type = reader.int32();
                                break;
                            case 2:
                                message.name = reader.string();
                                break;
                            case 3:
                                message.uniqueId = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a CommandSenderData message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.CommandSenderData} CommandSenderData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CommandSenderData.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a CommandSenderData message.
                 * @function verify
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                CommandSenderData.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                            default:
                                return "type: enum value expected";
                            case 0:
                            case 1:
                                break;
                        }
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.uniqueId != null && message.hasOwnProperty("uniqueId"))
                        if (!$util.isString(message.uniqueId))
                            return "uniqueId: string expected";
                    return null;
                };

                /**
                 * Creates a CommandSenderData message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.CommandSenderData} CommandSenderData
                 */
                CommandSenderData.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.CommandSenderData)
                        return object;
                    var message = new $root.spark.CommandSenderData();
                    switch (object.type) {
                        case "OTHER":
                        case 0:
                            message.type = 0;
                            break;
                        case "PLAYER":
                        case 1:
                            message.type = 1;
                            break;
                    }
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.uniqueId != null)
                        message.uniqueId = String(object.uniqueId);
                    return message;
                };

                /**
                 * Creates a plain object from a CommandSenderData message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.CommandSenderData
                 * @static
                 * @param {spark.CommandSenderData} message CommandSenderData
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                CommandSenderData.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.type = options.enums === String ? "OTHER" : 0;
                        object.name = "";
                        object.uniqueId = "";
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.spark.CommandSenderData.Type[message.type] : message.type;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.uniqueId != null && message.hasOwnProperty("uniqueId"))
                        object.uniqueId = message.uniqueId;
                    return object;
                };

                /**
                 * Converts this CommandSenderData to JSON.
                 * @function toJSON
                 * @memberof spark.CommandSenderData
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                CommandSenderData.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Type enum.
                 * @name spark.CommandSenderData.Type
                 * @enum {string}
                 * @property {number} OTHER=0 OTHER value
                 * @property {number} PLAYER=1 PLAYER value
                 */
                CommandSenderData.Type = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "OTHER"] = 0;
                    values[valuesById[1] = "PLAYER"] = 1;
                    return values;
                })();

                return CommandSenderData;
            })();

            spark.HeapData = (function() {

                /**
                 * Properties of a HeapData.
                 * @memberof spark
                 * @interface IHeapData
                 * @property {spark.IHeapMetadata|null} [metadata] HeapData metadata
                 * @property {Array.<spark.IHeapEntry>|null} [entries] HeapData entries
                 */

                /**
                 * Constructs a new HeapData.
                 * @memberof spark
                 * @classdesc Represents a HeapData.
                 * @implements IHeapData
                 * @constructor
                 * @param {spark.IHeapData=} [properties] Properties to set
                 */
                function HeapData(properties) {
                    this.entries = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * HeapData metadata.
                 * @member {spark.IHeapMetadata|null|undefined} metadata
                 * @memberof spark.HeapData
                 * @instance
                 */
                HeapData.prototype.metadata = null;

                /**
                 * HeapData entries.
                 * @member {Array.<spark.IHeapEntry>} entries
                 * @memberof spark.HeapData
                 * @instance
                 */
                HeapData.prototype.entries = $util.emptyArray;

                /**
                 * Creates a new HeapData instance using the specified properties.
                 * @function create
                 * @memberof spark.HeapData
                 * @static
                 * @param {spark.IHeapData=} [properties] Properties to set
                 * @returns {spark.HeapData} HeapData instance
                 */
                HeapData.create = function create(properties) {
                    return new HeapData(properties);
                };

                /**
                 * Encodes the specified HeapData message. Does not implicitly {@link spark.HeapData.verify|verify} messages.
                 * @function encode
                 * @memberof spark.HeapData
                 * @static
                 * @param {spark.IHeapData} message HeapData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeapData.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        $root.spark.HeapMetadata.encode(message.metadata, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.entries != null && message.entries.length)
                        for (var i = 0; i < message.entries.length; ++i)
                            $root.spark.HeapEntry.encode(message.entries[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified HeapData message, length delimited. Does not implicitly {@link spark.HeapData.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.HeapData
                 * @static
                 * @param {spark.IHeapData} message HeapData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeapData.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a HeapData message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.HeapData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.HeapData} HeapData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeapData.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.HeapData();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.metadata = $root.spark.HeapMetadata.decode(reader, reader.uint32());
                                break;
                            case 2:
                                if (!(message.entries && message.entries.length))
                                    message.entries = [];
                                message.entries.push($root.spark.HeapEntry.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a HeapData message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.HeapData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.HeapData} HeapData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeapData.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a HeapData message.
                 * @function verify
                 * @memberof spark.HeapData
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                HeapData.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        var error = $root.spark.HeapMetadata.verify(message.metadata);
                        if (error)
                            return "metadata." + error;
                    }
                    if (message.entries != null && message.hasOwnProperty("entries")) {
                        if (!Array.isArray(message.entries))
                            return "entries: array expected";
                        for (var i = 0; i < message.entries.length; ++i) {
                            var error = $root.spark.HeapEntry.verify(message.entries[i]);
                            if (error)
                                return "entries." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a HeapData message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.HeapData
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.HeapData} HeapData
                 */
                HeapData.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.HeapData)
                        return object;
                    var message = new $root.spark.HeapData();
                    if (object.metadata != null) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".spark.HeapData.metadata: object expected");
                        message.metadata = $root.spark.HeapMetadata.fromObject(object.metadata);
                    }
                    if (object.entries) {
                        if (!Array.isArray(object.entries))
                            throw TypeError(".spark.HeapData.entries: array expected");
                        message.entries = [];
                        for (var i = 0; i < object.entries.length; ++i) {
                            if (typeof object.entries[i] !== "object")
                                throw TypeError(".spark.HeapData.entries: object expected");
                            message.entries[i] = $root.spark.HeapEntry.fromObject(object.entries[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a HeapData message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.HeapData
                 * @static
                 * @param {spark.HeapData} message HeapData
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HeapData.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.entries = [];
                    if (options.defaults)
                        object.metadata = null;
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        object.metadata = $root.spark.HeapMetadata.toObject(message.metadata, options);
                    if (message.entries && message.entries.length) {
                        object.entries = [];
                        for (var j = 0; j < message.entries.length; ++j)
                            object.entries[j] = $root.spark.HeapEntry.toObject(message.entries[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this HeapData to JSON.
                 * @function toJSON
                 * @memberof spark.HeapData
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                HeapData.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return HeapData;
            })();

            spark.HeapMetadata = (function() {

                /**
                 * Properties of a HeapMetadata.
                 * @memberof spark
                 * @interface IHeapMetadata
                 * @property {spark.ICommandSenderData|null} [user] HeapMetadata user
                 */

                /**
                 * Constructs a new HeapMetadata.
                 * @memberof spark
                 * @classdesc Represents a HeapMetadata.
                 * @implements IHeapMetadata
                 * @constructor
                 * @param {spark.IHeapMetadata=} [properties] Properties to set
                 */
                function HeapMetadata(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * HeapMetadata user.
                 * @member {spark.ICommandSenderData|null|undefined} user
                 * @memberof spark.HeapMetadata
                 * @instance
                 */
                HeapMetadata.prototype.user = null;

                /**
                 * Creates a new HeapMetadata instance using the specified properties.
                 * @function create
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {spark.IHeapMetadata=} [properties] Properties to set
                 * @returns {spark.HeapMetadata} HeapMetadata instance
                 */
                HeapMetadata.create = function create(properties) {
                    return new HeapMetadata(properties);
                };

                /**
                 * Encodes the specified HeapMetadata message. Does not implicitly {@link spark.HeapMetadata.verify|verify} messages.
                 * @function encode
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {spark.IHeapMetadata} message HeapMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeapMetadata.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.user != null && message.hasOwnProperty("user"))
                        $root.spark.CommandSenderData.encode(message.user, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified HeapMetadata message, length delimited. Does not implicitly {@link spark.HeapMetadata.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {spark.IHeapMetadata} message HeapMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeapMetadata.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a HeapMetadata message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.HeapMetadata} HeapMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeapMetadata.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.HeapMetadata();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.user = $root.spark.CommandSenderData.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a HeapMetadata message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.HeapMetadata} HeapMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeapMetadata.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a HeapMetadata message.
                 * @function verify
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                HeapMetadata.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.user != null && message.hasOwnProperty("user")) {
                        var error = $root.spark.CommandSenderData.verify(message.user);
                        if (error)
                            return "user." + error;
                    }
                    return null;
                };

                /**
                 * Creates a HeapMetadata message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.HeapMetadata} HeapMetadata
                 */
                HeapMetadata.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.HeapMetadata)
                        return object;
                    var message = new $root.spark.HeapMetadata();
                    if (object.user != null) {
                        if (typeof object.user !== "object")
                            throw TypeError(".spark.HeapMetadata.user: object expected");
                        message.user = $root.spark.CommandSenderData.fromObject(object.user);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a HeapMetadata message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.HeapMetadata
                 * @static
                 * @param {spark.HeapMetadata} message HeapMetadata
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HeapMetadata.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.user = null;
                    if (message.user != null && message.hasOwnProperty("user"))
                        object.user = $root.spark.CommandSenderData.toObject(message.user, options);
                    return object;
                };

                /**
                 * Converts this HeapMetadata to JSON.
                 * @function toJSON
                 * @memberof spark.HeapMetadata
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                HeapMetadata.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return HeapMetadata;
            })();

            spark.HeapEntry = (function() {

                /**
                 * Properties of a HeapEntry.
                 * @memberof spark
                 * @interface IHeapEntry
                 * @property {number|null} [order] HeapEntry order
                 * @property {number|null} [instances] HeapEntry instances
                 * @property {number|Long|null} [size] HeapEntry size
                 * @property {string|null} [type] HeapEntry type
                 */

                /**
                 * Constructs a new HeapEntry.
                 * @memberof spark
                 * @classdesc Represents a HeapEntry.
                 * @implements IHeapEntry
                 * @constructor
                 * @param {spark.IHeapEntry=} [properties] Properties to set
                 */
                function HeapEntry(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * HeapEntry order.
                 * @member {number} order
                 * @memberof spark.HeapEntry
                 * @instance
                 */
                HeapEntry.prototype.order = 0;

                /**
                 * HeapEntry instances.
                 * @member {number} instances
                 * @memberof spark.HeapEntry
                 * @instance
                 */
                HeapEntry.prototype.instances = 0;

                /**
                 * HeapEntry size.
                 * @member {number|Long} size
                 * @memberof spark.HeapEntry
                 * @instance
                 */
                HeapEntry.prototype.size = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * HeapEntry type.
                 * @member {string} type
                 * @memberof spark.HeapEntry
                 * @instance
                 */
                HeapEntry.prototype.type = "";

                /**
                 * Creates a new HeapEntry instance using the specified properties.
                 * @function create
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {spark.IHeapEntry=} [properties] Properties to set
                 * @returns {spark.HeapEntry} HeapEntry instance
                 */
                HeapEntry.create = function create(properties) {
                    return new HeapEntry(properties);
                };

                /**
                 * Encodes the specified HeapEntry message. Does not implicitly {@link spark.HeapEntry.verify|verify} messages.
                 * @function encode
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {spark.IHeapEntry} message HeapEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeapEntry.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.order != null && message.hasOwnProperty("order"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.order);
                    if (message.instances != null && message.hasOwnProperty("instances"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.instances);
                    if (message.size != null && message.hasOwnProperty("size"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int64(message.size);
                    if (message.type != null && message.hasOwnProperty("type"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.type);
                    return writer;
                };

                /**
                 * Encodes the specified HeapEntry message, length delimited. Does not implicitly {@link spark.HeapEntry.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {spark.IHeapEntry} message HeapEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeapEntry.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a HeapEntry message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.HeapEntry} HeapEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeapEntry.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.HeapEntry();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.order = reader.int32();
                                break;
                            case 2:
                                message.instances = reader.int32();
                                break;
                            case 3:
                                message.size = reader.int64();
                                break;
                            case 4:
                                message.type = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a HeapEntry message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.HeapEntry} HeapEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeapEntry.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a HeapEntry message.
                 * @function verify
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                HeapEntry.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.order != null && message.hasOwnProperty("order"))
                        if (!$util.isInteger(message.order))
                            return "order: integer expected";
                    if (message.instances != null && message.hasOwnProperty("instances"))
                        if (!$util.isInteger(message.instances))
                            return "instances: integer expected";
                    if (message.size != null && message.hasOwnProperty("size"))
                        if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                            return "size: integer|Long expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        if (!$util.isString(message.type))
                            return "type: string expected";
                    return null;
                };

                /**
                 * Creates a HeapEntry message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.HeapEntry} HeapEntry
                 */
                HeapEntry.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.HeapEntry)
                        return object;
                    var message = new $root.spark.HeapEntry();
                    if (object.order != null)
                        message.order = object.order | 0;
                    if (object.instances != null)
                        message.instances = object.instances | 0;
                    if (object.size != null)
                        if ($util.Long)
                            (message.size = $util.Long.fromValue(object.size)).unsigned = false;
                        else if (typeof object.size === "string")
                            message.size = parseInt(object.size, 10);
                        else if (typeof object.size === "number")
                            message.size = object.size;
                        else if (typeof object.size === "object")
                            message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber();
                    if (object.type != null)
                        message.type = String(object.type);
                    return message;
                };

                /**
                 * Creates a plain object from a HeapEntry message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.HeapEntry
                 * @static
                 * @param {spark.HeapEntry} message HeapEntry
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HeapEntry.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.order = 0;
                        object.instances = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.size = options.longs === String ? "0" : 0;
                        object.type = "";
                    }
                    if (message.order != null && message.hasOwnProperty("order"))
                        object.order = message.order;
                    if (message.instances != null && message.hasOwnProperty("instances"))
                        object.instances = message.instances;
                    if (message.size != null && message.hasOwnProperty("size"))
                        if (typeof message.size === "number")
                            object.size = options.longs === String ? String(message.size) : message.size;
                        else
                            object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber() : message.size;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    return object;
                };

                /**
                 * Converts this HeapEntry to JSON.
                 * @function toJSON
                 * @memberof spark.HeapEntry
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                HeapEntry.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return HeapEntry;
            })();

            spark.SamplerData = (function() {

                /**
                 * Properties of a SamplerData.
                 * @memberof spark
                 * @interface ISamplerData
                 * @property {spark.ISamplerMetadata|null} [metadata] SamplerData metadata
                 * @property {Array.<spark.IThreadNode>|null} [threads] SamplerData threads
                 */

                /**
                 * Constructs a new SamplerData.
                 * @memberof spark
                 * @classdesc Represents a SamplerData.
                 * @implements ISamplerData
                 * @constructor
                 * @param {spark.ISamplerData=} [properties] Properties to set
                 */
                function SamplerData(properties) {
                    this.threads = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * SamplerData metadata.
                 * @member {spark.ISamplerMetadata|null|undefined} metadata
                 * @memberof spark.SamplerData
                 * @instance
                 */
                SamplerData.prototype.metadata = null;

                /**
                 * SamplerData threads.
                 * @member {Array.<spark.IThreadNode>} threads
                 * @memberof spark.SamplerData
                 * @instance
                 */
                SamplerData.prototype.threads = $util.emptyArray;

                /**
                 * Creates a new SamplerData instance using the specified properties.
                 * @function create
                 * @memberof spark.SamplerData
                 * @static
                 * @param {spark.ISamplerData=} [properties] Properties to set
                 * @returns {spark.SamplerData} SamplerData instance
                 */
                SamplerData.create = function create(properties) {
                    return new SamplerData(properties);
                };

                /**
                 * Encodes the specified SamplerData message. Does not implicitly {@link spark.SamplerData.verify|verify} messages.
                 * @function encode
                 * @memberof spark.SamplerData
                 * @static
                 * @param {spark.ISamplerData} message SamplerData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SamplerData.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        $root.spark.SamplerMetadata.encode(message.metadata, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.threads != null && message.threads.length)
                        for (var i = 0; i < message.threads.length; ++i)
                            $root.spark.ThreadNode.encode(message.threads[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified SamplerData message, length delimited. Does not implicitly {@link spark.SamplerData.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.SamplerData
                 * @static
                 * @param {spark.ISamplerData} message SamplerData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SamplerData.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a SamplerData message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.SamplerData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.SamplerData} SamplerData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SamplerData.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.SamplerData();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.metadata = $root.spark.SamplerMetadata.decode(reader, reader.uint32());
                                break;
                            case 2:
                                if (!(message.threads && message.threads.length))
                                    message.threads = [];
                                message.threads.push($root.spark.ThreadNode.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a SamplerData message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.SamplerData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.SamplerData} SamplerData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SamplerData.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a SamplerData message.
                 * @function verify
                 * @memberof spark.SamplerData
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                SamplerData.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        var error = $root.spark.SamplerMetadata.verify(message.metadata);
                        if (error)
                            return "metadata." + error;
                    }
                    if (message.threads != null && message.hasOwnProperty("threads")) {
                        if (!Array.isArray(message.threads))
                            return "threads: array expected";
                        for (var i = 0; i < message.threads.length; ++i) {
                            var error = $root.spark.ThreadNode.verify(message.threads[i]);
                            if (error)
                                return "threads." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a SamplerData message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.SamplerData
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.SamplerData} SamplerData
                 */
                SamplerData.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.SamplerData)
                        return object;
                    var message = new $root.spark.SamplerData();
                    if (object.metadata != null) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".spark.SamplerData.metadata: object expected");
                        message.metadata = $root.spark.SamplerMetadata.fromObject(object.metadata);
                    }
                    if (object.threads) {
                        if (!Array.isArray(object.threads))
                            throw TypeError(".spark.SamplerData.threads: array expected");
                        message.threads = [];
                        for (var i = 0; i < object.threads.length; ++i) {
                            if (typeof object.threads[i] !== "object")
                                throw TypeError(".spark.SamplerData.threads: object expected");
                            message.threads[i] = $root.spark.ThreadNode.fromObject(object.threads[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a SamplerData message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.SamplerData
                 * @static
                 * @param {spark.SamplerData} message SamplerData
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SamplerData.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.threads = [];
                    if (options.defaults)
                        object.metadata = null;
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        object.metadata = $root.spark.SamplerMetadata.toObject(message.metadata, options);
                    if (message.threads && message.threads.length) {
                        object.threads = [];
                        for (var j = 0; j < message.threads.length; ++j)
                            object.threads[j] = $root.spark.ThreadNode.toObject(message.threads[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this SamplerData to JSON.
                 * @function toJSON
                 * @memberof spark.SamplerData
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                SamplerData.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return SamplerData;
            })();

            spark.SamplerMetadata = (function() {

                /**
                 * Properties of a SamplerMetadata.
                 * @memberof spark
                 * @interface ISamplerMetadata
                 * @property {spark.ICommandSenderData|null} [user] SamplerMetadata user
                 * @property {number|Long|null} [startTime] SamplerMetadata startTime
                 * @property {number|null} [interval] SamplerMetadata interval
                 * @property {spark.SamplerMetadata.IThreadDumper|null} [threadDumper] SamplerMetadata threadDumper
                 * @property {spark.SamplerMetadata.IDataAggregator|null} [dataAggregator] SamplerMetadata dataAggregator
                 */

                /**
                 * Constructs a new SamplerMetadata.
                 * @memberof spark
                 * @classdesc Represents a SamplerMetadata.
                 * @implements ISamplerMetadata
                 * @constructor
                 * @param {spark.ISamplerMetadata=} [properties] Properties to set
                 */
                function SamplerMetadata(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * SamplerMetadata user.
                 * @member {spark.ICommandSenderData|null|undefined} user
                 * @memberof spark.SamplerMetadata
                 * @instance
                 */
                SamplerMetadata.prototype.user = null;

                /**
                 * SamplerMetadata startTime.
                 * @member {number|Long} startTime
                 * @memberof spark.SamplerMetadata
                 * @instance
                 */
                SamplerMetadata.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * SamplerMetadata interval.
                 * @member {number} interval
                 * @memberof spark.SamplerMetadata
                 * @instance
                 */
                SamplerMetadata.prototype.interval = 0;

                /**
                 * SamplerMetadata threadDumper.
                 * @member {spark.SamplerMetadata.IThreadDumper|null|undefined} threadDumper
                 * @memberof spark.SamplerMetadata
                 * @instance
                 */
                SamplerMetadata.prototype.threadDumper = null;

                /**
                 * SamplerMetadata dataAggregator.
                 * @member {spark.SamplerMetadata.IDataAggregator|null|undefined} dataAggregator
                 * @memberof spark.SamplerMetadata
                 * @instance
                 */
                SamplerMetadata.prototype.dataAggregator = null;

                /**
                 * Creates a new SamplerMetadata instance using the specified properties.
                 * @function create
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {spark.ISamplerMetadata=} [properties] Properties to set
                 * @returns {spark.SamplerMetadata} SamplerMetadata instance
                 */
                SamplerMetadata.create = function create(properties) {
                    return new SamplerMetadata(properties);
                };

                /**
                 * Encodes the specified SamplerMetadata message. Does not implicitly {@link spark.SamplerMetadata.verify|verify} messages.
                 * @function encode
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {spark.ISamplerMetadata} message SamplerMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SamplerMetadata.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.user != null && message.hasOwnProperty("user"))
                        $root.spark.CommandSenderData.encode(message.user, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.startTime != null && message.hasOwnProperty("startTime"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int64(message.startTime);
                    if (message.interval != null && message.hasOwnProperty("interval"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.interval);
                    if (message.threadDumper != null && message.hasOwnProperty("threadDumper"))
                        $root.spark.SamplerMetadata.ThreadDumper.encode(message.threadDumper, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.dataAggregator != null && message.hasOwnProperty("dataAggregator"))
                        $root.spark.SamplerMetadata.DataAggregator.encode(message.dataAggregator, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified SamplerMetadata message, length delimited. Does not implicitly {@link spark.SamplerMetadata.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {spark.ISamplerMetadata} message SamplerMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SamplerMetadata.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a SamplerMetadata message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.SamplerMetadata} SamplerMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SamplerMetadata.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.SamplerMetadata();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.user = $root.spark.CommandSenderData.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.startTime = reader.int64();
                                break;
                            case 3:
                                message.interval = reader.int32();
                                break;
                            case 4:
                                message.threadDumper = $root.spark.SamplerMetadata.ThreadDumper.decode(reader, reader.uint32());
                                break;
                            case 5:
                                message.dataAggregator = $root.spark.SamplerMetadata.DataAggregator.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a SamplerMetadata message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.SamplerMetadata} SamplerMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SamplerMetadata.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a SamplerMetadata message.
                 * @function verify
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                SamplerMetadata.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.user != null && message.hasOwnProperty("user")) {
                        var error = $root.spark.CommandSenderData.verify(message.user);
                        if (error)
                            return "user." + error;
                    }
                    if (message.startTime != null && message.hasOwnProperty("startTime"))
                        if (!$util.isInteger(message.startTime) && !(message.startTime && $util.isInteger(message.startTime.low) && $util.isInteger(message.startTime.high)))
                            return "startTime: integer|Long expected";
                    if (message.interval != null && message.hasOwnProperty("interval"))
                        if (!$util.isInteger(message.interval))
                            return "interval: integer expected";
                    if (message.threadDumper != null && message.hasOwnProperty("threadDumper")) {
                        var error = $root.spark.SamplerMetadata.ThreadDumper.verify(message.threadDumper);
                        if (error)
                            return "threadDumper." + error;
                    }
                    if (message.dataAggregator != null && message.hasOwnProperty("dataAggregator")) {
                        var error = $root.spark.SamplerMetadata.DataAggregator.verify(message.dataAggregator);
                        if (error)
                            return "dataAggregator." + error;
                    }
                    return null;
                };

                /**
                 * Creates a SamplerMetadata message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.SamplerMetadata} SamplerMetadata
                 */
                SamplerMetadata.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.SamplerMetadata)
                        return object;
                    var message = new $root.spark.SamplerMetadata();
                    if (object.user != null) {
                        if (typeof object.user !== "object")
                            throw TypeError(".spark.SamplerMetadata.user: object expected");
                        message.user = $root.spark.CommandSenderData.fromObject(object.user);
                    }
                    if (object.startTime != null)
                        if ($util.Long)
                            (message.startTime = $util.Long.fromValue(object.startTime)).unsigned = false;
                        else if (typeof object.startTime === "string")
                            message.startTime = parseInt(object.startTime, 10);
                        else if (typeof object.startTime === "number")
                            message.startTime = object.startTime;
                        else if (typeof object.startTime === "object")
                            message.startTime = new $util.LongBits(object.startTime.low >>> 0, object.startTime.high >>> 0).toNumber();
                    if (object.interval != null)
                        message.interval = object.interval | 0;
                    if (object.threadDumper != null) {
                        if (typeof object.threadDumper !== "object")
                            throw TypeError(".spark.SamplerMetadata.threadDumper: object expected");
                        message.threadDumper = $root.spark.SamplerMetadata.ThreadDumper.fromObject(object.threadDumper);
                    }
                    if (object.dataAggregator != null) {
                        if (typeof object.dataAggregator !== "object")
                            throw TypeError(".spark.SamplerMetadata.dataAggregator: object expected");
                        message.dataAggregator = $root.spark.SamplerMetadata.DataAggregator.fromObject(object.dataAggregator);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a SamplerMetadata message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.SamplerMetadata
                 * @static
                 * @param {spark.SamplerMetadata} message SamplerMetadata
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SamplerMetadata.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.user = null;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.startTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.startTime = options.longs === String ? "0" : 0;
                        object.interval = 0;
                        object.threadDumper = null;
                        object.dataAggregator = null;
                    }
                    if (message.user != null && message.hasOwnProperty("user"))
                        object.user = $root.spark.CommandSenderData.toObject(message.user, options);
                    if (message.startTime != null && message.hasOwnProperty("startTime"))
                        if (typeof message.startTime === "number")
                            object.startTime = options.longs === String ? String(message.startTime) : message.startTime;
                        else
                            object.startTime = options.longs === String ? $util.Long.prototype.toString.call(message.startTime) : options.longs === Number ? new $util.LongBits(message.startTime.low >>> 0, message.startTime.high >>> 0).toNumber() : message.startTime;
                    if (message.interval != null && message.hasOwnProperty("interval"))
                        object.interval = message.interval;
                    if (message.threadDumper != null && message.hasOwnProperty("threadDumper"))
                        object.threadDumper = $root.spark.SamplerMetadata.ThreadDumper.toObject(message.threadDumper, options);
                    if (message.dataAggregator != null && message.hasOwnProperty("dataAggregator"))
                        object.dataAggregator = $root.spark.SamplerMetadata.DataAggregator.toObject(message.dataAggregator, options);
                    return object;
                };

                /**
                 * Converts this SamplerMetadata to JSON.
                 * @function toJSON
                 * @memberof spark.SamplerMetadata
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                SamplerMetadata.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                SamplerMetadata.ThreadDumper = (function() {

                    /**
                     * Properties of a ThreadDumper.
                     * @memberof spark.SamplerMetadata
                     * @interface IThreadDumper
                     * @property {spark.SamplerMetadata.ThreadDumper.Type|null} [type] ThreadDumper type
                     * @property {Array.<number|Long>|null} [ids] ThreadDumper ids
                     * @property {Array.<string>|null} [patterns] ThreadDumper patterns
                     */

                    /**
                     * Constructs a new ThreadDumper.
                     * @memberof spark.SamplerMetadata
                     * @classdesc Represents a ThreadDumper.
                     * @implements IThreadDumper
                     * @constructor
                     * @param {spark.SamplerMetadata.IThreadDumper=} [properties] Properties to set
                     */
                    function ThreadDumper(properties) {
                        this.ids = [];
                        this.patterns = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * ThreadDumper type.
                     * @member {spark.SamplerMetadata.ThreadDumper.Type} type
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @instance
                     */
                    ThreadDumper.prototype.type = 0;

                    /**
                     * ThreadDumper ids.
                     * @member {Array.<number|Long>} ids
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @instance
                     */
                    ThreadDumper.prototype.ids = $util.emptyArray;

                    /**
                     * ThreadDumper patterns.
                     * @member {Array.<string>} patterns
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @instance
                     */
                    ThreadDumper.prototype.patterns = $util.emptyArray;

                    /**
                     * Creates a new ThreadDumper instance using the specified properties.
                     * @function create
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {spark.SamplerMetadata.IThreadDumper=} [properties] Properties to set
                     * @returns {spark.SamplerMetadata.ThreadDumper} ThreadDumper instance
                     */
                    ThreadDumper.create = function create(properties) {
                        return new ThreadDumper(properties);
                    };

                    /**
                     * Encodes the specified ThreadDumper message. Does not implicitly {@link spark.SamplerMetadata.ThreadDumper.verify|verify} messages.
                     * @function encode
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {spark.SamplerMetadata.IThreadDumper} message ThreadDumper message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ThreadDumper.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.type != null && message.hasOwnProperty("type"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                        if (message.ids != null && message.ids.length) {
                            writer.uint32(/* id 2, wireType 2 =*/18).fork();
                            for (var i = 0; i < message.ids.length; ++i)
                                writer.int64(message.ids[i]);
                            writer.ldelim();
                        }
                        if (message.patterns != null && message.patterns.length)
                            for (var i = 0; i < message.patterns.length; ++i)
                                writer.uint32(/* id 3, wireType 2 =*/26).string(message.patterns[i]);
                        return writer;
                    };

                    /**
                     * Encodes the specified ThreadDumper message, length delimited. Does not implicitly {@link spark.SamplerMetadata.ThreadDumper.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {spark.SamplerMetadata.IThreadDumper} message ThreadDumper message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ThreadDumper.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a ThreadDumper message from the specified reader or buffer.
                     * @function decode
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {spark.SamplerMetadata.ThreadDumper} ThreadDumper
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ThreadDumper.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.SamplerMetadata.ThreadDumper();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                                case 1:
                                    message.type = reader.int32();
                                    break;
                                case 2:
                                    if (!(message.ids && message.ids.length))
                                        message.ids = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.ids.push(reader.int64());
                                    } else
                                        message.ids.push(reader.int64());
                                    break;
                                case 3:
                                    if (!(message.patterns && message.patterns.length))
                                        message.patterns = [];
                                    message.patterns.push(reader.string());
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a ThreadDumper message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {spark.SamplerMetadata.ThreadDumper} ThreadDumper
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ThreadDumper.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a ThreadDumper message.
                     * @function verify
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    ThreadDumper.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.type != null && message.hasOwnProperty("type"))
                            switch (message.type) {
                                default:
                                    return "type: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break;
                            }
                        if (message.ids != null && message.hasOwnProperty("ids")) {
                            if (!Array.isArray(message.ids))
                                return "ids: array expected";
                            for (var i = 0; i < message.ids.length; ++i)
                                if (!$util.isInteger(message.ids[i]) && !(message.ids[i] && $util.isInteger(message.ids[i].low) && $util.isInteger(message.ids[i].high)))
                                    return "ids: integer|Long[] expected";
                        }
                        if (message.patterns != null && message.hasOwnProperty("patterns")) {
                            if (!Array.isArray(message.patterns))
                                return "patterns: array expected";
                            for (var i = 0; i < message.patterns.length; ++i)
                                if (!$util.isString(message.patterns[i]))
                                    return "patterns: string[] expected";
                        }
                        return null;
                    };

                    /**
                     * Creates a ThreadDumper message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {spark.SamplerMetadata.ThreadDumper} ThreadDumper
                     */
                    ThreadDumper.fromObject = function fromObject(object) {
                        if (object instanceof $root.spark.SamplerMetadata.ThreadDumper)
                            return object;
                        var message = new $root.spark.SamplerMetadata.ThreadDumper();
                        switch (object.type) {
                            case "ALL":
                            case 0:
                                message.type = 0;
                                break;
                            case "SPECIFIC":
                            case 1:
                                message.type = 1;
                                break;
                            case "REGEX":
                            case 2:
                                message.type = 2;
                                break;
                        }
                        if (object.ids) {
                            if (!Array.isArray(object.ids))
                                throw TypeError(".spark.SamplerMetadata.ThreadDumper.ids: array expected");
                            message.ids = [];
                            for (var i = 0; i < object.ids.length; ++i)
                                if ($util.Long)
                                    (message.ids[i] = $util.Long.fromValue(object.ids[i])).unsigned = false;
                                else if (typeof object.ids[i] === "string")
                                    message.ids[i] = parseInt(object.ids[i], 10);
                                else if (typeof object.ids[i] === "number")
                                    message.ids[i] = object.ids[i];
                                else if (typeof object.ids[i] === "object")
                                    message.ids[i] = new $util.LongBits(object.ids[i].low >>> 0, object.ids[i].high >>> 0).toNumber();
                        }
                        if (object.patterns) {
                            if (!Array.isArray(object.patterns))
                                throw TypeError(".spark.SamplerMetadata.ThreadDumper.patterns: array expected");
                            message.patterns = [];
                            for (var i = 0; i < object.patterns.length; ++i)
                                message.patterns[i] = String(object.patterns[i]);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a ThreadDumper message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @static
                     * @param {spark.SamplerMetadata.ThreadDumper} message ThreadDumper
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    ThreadDumper.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.ids = [];
                            object.patterns = [];
                        }
                        if (options.defaults)
                            object.type = options.enums === String ? "ALL" : 0;
                        if (message.type != null && message.hasOwnProperty("type"))
                            object.type = options.enums === String ? $root.spark.SamplerMetadata.ThreadDumper.Type[message.type] : message.type;
                        if (message.ids && message.ids.length) {
                            object.ids = [];
                            for (var j = 0; j < message.ids.length; ++j)
                                if (typeof message.ids[j] === "number")
                                    object.ids[j] = options.longs === String ? String(message.ids[j]) : message.ids[j];
                                else
                                    object.ids[j] = options.longs === String ? $util.Long.prototype.toString.call(message.ids[j]) : options.longs === Number ? new $util.LongBits(message.ids[j].low >>> 0, message.ids[j].high >>> 0).toNumber() : message.ids[j];
                        }
                        if (message.patterns && message.patterns.length) {
                            object.patterns = [];
                            for (var j = 0; j < message.patterns.length; ++j)
                                object.patterns[j] = message.patterns[j];
                        }
                        return object;
                    };

                    /**
                     * Converts this ThreadDumper to JSON.
                     * @function toJSON
                     * @memberof spark.SamplerMetadata.ThreadDumper
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    ThreadDumper.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Type enum.
                     * @name spark.SamplerMetadata.ThreadDumper.Type
                     * @enum {string}
                     * @property {number} ALL=0 ALL value
                     * @property {number} SPECIFIC=1 SPECIFIC value
                     * @property {number} REGEX=2 REGEX value
                     */
                    ThreadDumper.Type = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "ALL"] = 0;
                        values[valuesById[1] = "SPECIFIC"] = 1;
                        values[valuesById[2] = "REGEX"] = 2;
                        return values;
                    })();

                    return ThreadDumper;
                })();

                SamplerMetadata.DataAggregator = (function() {

                    /**
                     * Properties of a DataAggregator.
                     * @memberof spark.SamplerMetadata
                     * @interface IDataAggregator
                     * @property {spark.SamplerMetadata.DataAggregator.Type|null} [type] DataAggregator type
                     * @property {spark.SamplerMetadata.DataAggregator.ThreadGrouper|null} [threadGrouper] DataAggregator threadGrouper
                     * @property {number|Long|null} [tickLengthThreshold] DataAggregator tickLengthThreshold
                     */

                    /**
                     * Constructs a new DataAggregator.
                     * @memberof spark.SamplerMetadata
                     * @classdesc Represents a DataAggregator.
                     * @implements IDataAggregator
                     * @constructor
                     * @param {spark.SamplerMetadata.IDataAggregator=} [properties] Properties to set
                     */
                    function DataAggregator(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * DataAggregator type.
                     * @member {spark.SamplerMetadata.DataAggregator.Type} type
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @instance
                     */
                    DataAggregator.prototype.type = 0;

                    /**
                     * DataAggregator threadGrouper.
                     * @member {spark.SamplerMetadata.DataAggregator.ThreadGrouper} threadGrouper
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @instance
                     */
                    DataAggregator.prototype.threadGrouper = 0;

                    /**
                     * DataAggregator tickLengthThreshold.
                     * @member {number|Long} tickLengthThreshold
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @instance
                     */
                    DataAggregator.prototype.tickLengthThreshold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new DataAggregator instance using the specified properties.
                     * @function create
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {spark.SamplerMetadata.IDataAggregator=} [properties] Properties to set
                     * @returns {spark.SamplerMetadata.DataAggregator} DataAggregator instance
                     */
                    DataAggregator.create = function create(properties) {
                        return new DataAggregator(properties);
                    };

                    /**
                     * Encodes the specified DataAggregator message. Does not implicitly {@link spark.SamplerMetadata.DataAggregator.verify|verify} messages.
                     * @function encode
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {spark.SamplerMetadata.IDataAggregator} message DataAggregator message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataAggregator.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.type != null && message.hasOwnProperty("type"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                        if (message.threadGrouper != null && message.hasOwnProperty("threadGrouper"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.threadGrouper);
                        if (message.tickLengthThreshold != null && message.hasOwnProperty("tickLengthThreshold"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.tickLengthThreshold);
                        return writer;
                    };

                    /**
                     * Encodes the specified DataAggregator message, length delimited. Does not implicitly {@link spark.SamplerMetadata.DataAggregator.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {spark.SamplerMetadata.IDataAggregator} message DataAggregator message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataAggregator.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a DataAggregator message from the specified reader or buffer.
                     * @function decode
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {spark.SamplerMetadata.DataAggregator} DataAggregator
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataAggregator.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.SamplerMetadata.DataAggregator();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                                case 1:
                                    message.type = reader.int32();
                                    break;
                                case 2:
                                    message.threadGrouper = reader.int32();
                                    break;
                                case 3:
                                    message.tickLengthThreshold = reader.int64();
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a DataAggregator message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {spark.SamplerMetadata.DataAggregator} DataAggregator
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataAggregator.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a DataAggregator message.
                     * @function verify
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DataAggregator.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.type != null && message.hasOwnProperty("type"))
                            switch (message.type) {
                                default:
                                    return "type: enum value expected";
                                case 0:
                                case 1:
                                    break;
                            }
                        if (message.threadGrouper != null && message.hasOwnProperty("threadGrouper"))
                            switch (message.threadGrouper) {
                                default:
                                    return "threadGrouper: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break;
                            }
                        if (message.tickLengthThreshold != null && message.hasOwnProperty("tickLengthThreshold"))
                            if (!$util.isInteger(message.tickLengthThreshold) && !(message.tickLengthThreshold && $util.isInteger(message.tickLengthThreshold.low) && $util.isInteger(message.tickLengthThreshold.high)))
                                return "tickLengthThreshold: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a DataAggregator message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {spark.SamplerMetadata.DataAggregator} DataAggregator
                     */
                    DataAggregator.fromObject = function fromObject(object) {
                        if (object instanceof $root.spark.SamplerMetadata.DataAggregator)
                            return object;
                        var message = new $root.spark.SamplerMetadata.DataAggregator();
                        switch (object.type) {
                            case "SIMPLE":
                            case 0:
                                message.type = 0;
                                break;
                            case "TICKED":
                            case 1:
                                message.type = 1;
                                break;
                        }
                        switch (object.threadGrouper) {
                            case "BY_NAME":
                            case 0:
                                message.threadGrouper = 0;
                                break;
                            case "BY_POOL":
                            case 1:
                                message.threadGrouper = 1;
                                break;
                            case "AS_ONE":
                            case 2:
                                message.threadGrouper = 2;
                                break;
                        }
                        if (object.tickLengthThreshold != null)
                            if ($util.Long)
                                (message.tickLengthThreshold = $util.Long.fromValue(object.tickLengthThreshold)).unsigned = false;
                            else if (typeof object.tickLengthThreshold === "string")
                                message.tickLengthThreshold = parseInt(object.tickLengthThreshold, 10);
                            else if (typeof object.tickLengthThreshold === "number")
                                message.tickLengthThreshold = object.tickLengthThreshold;
                            else if (typeof object.tickLengthThreshold === "object")
                                message.tickLengthThreshold = new $util.LongBits(object.tickLengthThreshold.low >>> 0, object.tickLengthThreshold.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from a DataAggregator message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @static
                     * @param {spark.SamplerMetadata.DataAggregator} message DataAggregator
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DataAggregator.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.type = options.enums === String ? "SIMPLE" : 0;
                            object.threadGrouper = options.enums === String ? "BY_NAME" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.tickLengthThreshold = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.tickLengthThreshold = options.longs === String ? "0" : 0;
                        }
                        if (message.type != null && message.hasOwnProperty("type"))
                            object.type = options.enums === String ? $root.spark.SamplerMetadata.DataAggregator.Type[message.type] : message.type;
                        if (message.threadGrouper != null && message.hasOwnProperty("threadGrouper"))
                            object.threadGrouper = options.enums === String ? $root.spark.SamplerMetadata.DataAggregator.ThreadGrouper[message.threadGrouper] : message.threadGrouper;
                        if (message.tickLengthThreshold != null && message.hasOwnProperty("tickLengthThreshold"))
                            if (typeof message.tickLengthThreshold === "number")
                                object.tickLengthThreshold = options.longs === String ? String(message.tickLengthThreshold) : message.tickLengthThreshold;
                            else
                                object.tickLengthThreshold = options.longs === String ? $util.Long.prototype.toString.call(message.tickLengthThreshold) : options.longs === Number ? new $util.LongBits(message.tickLengthThreshold.low >>> 0, message.tickLengthThreshold.high >>> 0).toNumber() : message.tickLengthThreshold;
                        return object;
                    };

                    /**
                     * Converts this DataAggregator to JSON.
                     * @function toJSON
                     * @memberof spark.SamplerMetadata.DataAggregator
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DataAggregator.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Type enum.
                     * @name spark.SamplerMetadata.DataAggregator.Type
                     * @enum {string}
                     * @property {number} SIMPLE=0 SIMPLE value
                     * @property {number} TICKED=1 TICKED value
                     */
                    DataAggregator.Type = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "SIMPLE"] = 0;
                        values[valuesById[1] = "TICKED"] = 1;
                        return values;
                    })();

                    /**
                     * ThreadGrouper enum.
                     * @name spark.SamplerMetadata.DataAggregator.ThreadGrouper
                     * @enum {string}
                     * @property {number} BY_NAME=0 BY_NAME value
                     * @property {number} BY_POOL=1 BY_POOL value
                     * @property {number} AS_ONE=2 AS_ONE value
                     */
                    DataAggregator.ThreadGrouper = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "BY_NAME"] = 0;
                        values[valuesById[1] = "BY_POOL"] = 1;
                        values[valuesById[2] = "AS_ONE"] = 2;
                        return values;
                    })();

                    return DataAggregator;
                })();

                return SamplerMetadata;
            })();

            spark.StackTraceNode = (function() {

                /**
                 * Properties of a StackTraceNode.
                 * @memberof spark
                 * @interface IStackTraceNode
                 * @property {number|null} [time] StackTraceNode time
                 * @property {Array.<spark.IStackTraceNode>|null} [children] StackTraceNode children
                 * @property {string|null} [className] StackTraceNode className
                 * @property {string|null} [methodName] StackTraceNode methodName
                 * @property {number|null} [lineNumber] StackTraceNode lineNumber
                 */

                /**
                 * Constructs a new StackTraceNode.
                 * @memberof spark
                 * @classdesc Represents a StackTraceNode.
                 * @implements IStackTraceNode
                 * @constructor
                 * @param {spark.IStackTraceNode=} [properties] Properties to set
                 */
                function StackTraceNode(properties) {
                    this.children = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * StackTraceNode time.
                 * @member {number} time
                 * @memberof spark.StackTraceNode
                 * @instance
                 */
                StackTraceNode.prototype.time = 0;

                /**
                 * StackTraceNode children.
                 * @member {Array.<spark.IStackTraceNode>} children
                 * @memberof spark.StackTraceNode
                 * @instance
                 */
                StackTraceNode.prototype.children = $util.emptyArray;

                /**
                 * StackTraceNode className.
                 * @member {string} className
                 * @memberof spark.StackTraceNode
                 * @instance
                 */
                StackTraceNode.prototype.className = "";

                /**
                 * StackTraceNode methodName.
                 * @member {string} methodName
                 * @memberof spark.StackTraceNode
                 * @instance
                 */
                StackTraceNode.prototype.methodName = "";

                /**
                 * StackTraceNode lineNumber.
                 * @member {number} lineNumber
                 * @memberof spark.StackTraceNode
                 * @instance
                 */
                StackTraceNode.prototype.lineNumber = 0;

                /**
                 * Creates a new StackTraceNode instance using the specified properties.
                 * @function create
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {spark.IStackTraceNode=} [properties] Properties to set
                 * @returns {spark.StackTraceNode} StackTraceNode instance
                 */
                StackTraceNode.create = function create(properties) {
                    return new StackTraceNode(properties);
                };

                /**
                 * Encodes the specified StackTraceNode message. Does not implicitly {@link spark.StackTraceNode.verify|verify} messages.
                 * @function encode
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {spark.IStackTraceNode} message StackTraceNode message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                StackTraceNode.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.time != null && message.hasOwnProperty("time"))
                        writer.uint32(/* id 1, wireType 1 =*/9).double(message.time);
                    if (message.children != null && message.children.length)
                        for (var i = 0; i < message.children.length; ++i)
                            $root.spark.StackTraceNode.encode(message.children[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.className != null && message.hasOwnProperty("className"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.className);
                    if (message.methodName != null && message.hasOwnProperty("methodName"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.methodName);
                    if (message.lineNumber != null && message.hasOwnProperty("lineNumber"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.lineNumber);
                    return writer;
                };

                /**
                 * Encodes the specified StackTraceNode message, length delimited. Does not implicitly {@link spark.StackTraceNode.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {spark.IStackTraceNode} message StackTraceNode message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                StackTraceNode.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a StackTraceNode message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.StackTraceNode} StackTraceNode
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                StackTraceNode.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.StackTraceNode();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.time = reader.double();
                                break;
                            case 2:
                                if (!(message.children && message.children.length))
                                    message.children = [];
                                message.children.push($root.spark.StackTraceNode.decode(reader, reader.uint32()));
                                break;
                            case 3:
                                message.className = reader.string();
                                break;
                            case 4:
                                message.methodName = reader.string();
                                break;
                            case 5:
                                message.lineNumber = reader.int32();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a StackTraceNode message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.StackTraceNode} StackTraceNode
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                StackTraceNode.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a StackTraceNode message.
                 * @function verify
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                StackTraceNode.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.time != null && message.hasOwnProperty("time"))
                        if (typeof message.time !== "number")
                            return "time: number expected";
                    if (message.children != null && message.hasOwnProperty("children")) {
                        if (!Array.isArray(message.children))
                            return "children: array expected";
                        for (var i = 0; i < message.children.length; ++i) {
                            var error = $root.spark.StackTraceNode.verify(message.children[i]);
                            if (error)
                                return "children." + error;
                        }
                    }
                    if (message.className != null && message.hasOwnProperty("className"))
                        if (!$util.isString(message.className))
                            return "className: string expected";
                    if (message.methodName != null && message.hasOwnProperty("methodName"))
                        if (!$util.isString(message.methodName))
                            return "methodName: string expected";
                    if (message.lineNumber != null && message.hasOwnProperty("lineNumber"))
                        if (!$util.isInteger(message.lineNumber))
                            return "lineNumber: integer expected";
                    return null;
                };

                /**
                 * Creates a StackTraceNode message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.StackTraceNode} StackTraceNode
                 */
                StackTraceNode.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.StackTraceNode)
                        return object;
                    var message = new $root.spark.StackTraceNode();
                    if (object.time != null)
                        message.time = Number(object.time);
                    if (object.children) {
                        if (!Array.isArray(object.children))
                            throw TypeError(".spark.StackTraceNode.children: array expected");
                        message.children = [];
                        for (var i = 0; i < object.children.length; ++i) {
                            if (typeof object.children[i] !== "object")
                                throw TypeError(".spark.StackTraceNode.children: object expected");
                            message.children[i] = $root.spark.StackTraceNode.fromObject(object.children[i]);
                        }
                    }
                    if (object.className != null)
                        message.className = String(object.className);
                    if (object.methodName != null)
                        message.methodName = String(object.methodName);
                    if (object.lineNumber != null)
                        message.lineNumber = object.lineNumber | 0;
                    return message;
                };

                /**
                 * Creates a plain object from a StackTraceNode message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.StackTraceNode
                 * @static
                 * @param {spark.StackTraceNode} message StackTraceNode
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                StackTraceNode.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.children = [];
                    if (options.defaults) {
                        object.time = 0;
                        object.className = "";
                        object.methodName = "";
                        object.lineNumber = 0;
                    }
                    if (message.time != null && message.hasOwnProperty("time"))
                        object.time = options.json && !isFinite(message.time) ? String(message.time) : message.time;
                    if (message.children && message.children.length) {
                        object.children = [];
                        for (var j = 0; j < message.children.length; ++j)
                            object.children[j] = $root.spark.StackTraceNode.toObject(message.children[j], options);
                    }
                    if (message.className != null && message.hasOwnProperty("className"))
                        object.className = message.className;
                    if (message.methodName != null && message.hasOwnProperty("methodName"))
                        object.methodName = message.methodName;
                    if (message.lineNumber != null && message.hasOwnProperty("lineNumber"))
                        object.lineNumber = message.lineNumber;
                    return object;
                };

                /**
                 * Converts this StackTraceNode to JSON.
                 * @function toJSON
                 * @memberof spark.StackTraceNode
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                StackTraceNode.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return StackTraceNode;
            })();

            spark.ThreadNode = (function() {

                /**
                 * Properties of a ThreadNode.
                 * @memberof spark
                 * @interface IThreadNode
                 * @property {string|null} [name] ThreadNode name
                 * @property {number|null} [time] ThreadNode time
                 * @property {Array.<spark.IStackTraceNode>|null} [children] ThreadNode children
                 */

                /**
                 * Constructs a new ThreadNode.
                 * @memberof spark
                 * @classdesc Represents a ThreadNode.
                 * @implements IThreadNode
                 * @constructor
                 * @param {spark.IThreadNode=} [properties] Properties to set
                 */
                function ThreadNode(properties) {
                    this.children = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ThreadNode name.
                 * @member {string} name
                 * @memberof spark.ThreadNode
                 * @instance
                 */
                ThreadNode.prototype.name = "";

                /**
                 * ThreadNode time.
                 * @member {number} time
                 * @memberof spark.ThreadNode
                 * @instance
                 */
                ThreadNode.prototype.time = 0;

                /**
                 * ThreadNode children.
                 * @member {Array.<spark.IStackTraceNode>} children
                 * @memberof spark.ThreadNode
                 * @instance
                 */
                ThreadNode.prototype.children = $util.emptyArray;

                /**
                 * Creates a new ThreadNode instance using the specified properties.
                 * @function create
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {spark.IThreadNode=} [properties] Properties to set
                 * @returns {spark.ThreadNode} ThreadNode instance
                 */
                ThreadNode.create = function create(properties) {
                    return new ThreadNode(properties);
                };

                /**
                 * Encodes the specified ThreadNode message. Does not implicitly {@link spark.ThreadNode.verify|verify} messages.
                 * @function encode
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {spark.IThreadNode} message ThreadNode message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ThreadNode.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.time != null && message.hasOwnProperty("time"))
                        writer.uint32(/* id 2, wireType 1 =*/17).double(message.time);
                    if (message.children != null && message.children.length)
                        for (var i = 0; i < message.children.length; ++i)
                            $root.spark.StackTraceNode.encode(message.children[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ThreadNode message, length delimited. Does not implicitly {@link spark.ThreadNode.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {spark.IThreadNode} message ThreadNode message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ThreadNode.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ThreadNode message from the specified reader or buffer.
                 * @function decode
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {spark.ThreadNode} ThreadNode
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ThreadNode.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.spark.ThreadNode();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1:
                                message.name = reader.string();
                                break;
                            case 2:
                                message.time = reader.double();
                                break;
                            case 3:
                                if (!(message.children && message.children.length))
                                    message.children = [];
                                message.children.push($root.spark.StackTraceNode.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ThreadNode message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {spark.ThreadNode} ThreadNode
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ThreadNode.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ThreadNode message.
                 * @function verify
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ThreadNode.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.time != null && message.hasOwnProperty("time"))
                        if (typeof message.time !== "number")
                            return "time: number expected";
                    if (message.children != null && message.hasOwnProperty("children")) {
                        if (!Array.isArray(message.children))
                            return "children: array expected";
                        for (var i = 0; i < message.children.length; ++i) {
                            var error = $root.spark.StackTraceNode.verify(message.children[i]);
                            if (error)
                                return "children." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a ThreadNode message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {spark.ThreadNode} ThreadNode
                 */
                ThreadNode.fromObject = function fromObject(object) {
                    if (object instanceof $root.spark.ThreadNode)
                        return object;
                    var message = new $root.spark.ThreadNode();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.time != null)
                        message.time = Number(object.time);
                    if (object.children) {
                        if (!Array.isArray(object.children))
                            throw TypeError(".spark.ThreadNode.children: array expected");
                        message.children = [];
                        for (var i = 0; i < object.children.length; ++i) {
                            if (typeof object.children[i] !== "object")
                                throw TypeError(".spark.ThreadNode.children: object expected");
                            message.children[i] = $root.spark.StackTraceNode.fromObject(object.children[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ThreadNode message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof spark.ThreadNode
                 * @static
                 * @param {spark.ThreadNode} message ThreadNode
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ThreadNode.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.children = [];
                    if (options.defaults) {
                        object.name = "";
                        object.time = 0;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.time != null && message.hasOwnProperty("time"))
                        object.time = options.json && !isFinite(message.time) ? String(message.time) : message.time;
                    if (message.children && message.children.length) {
                        object.children = [];
                        for (var j = 0; j < message.children.length; ++j)
                            object.children[j] = $root.spark.StackTraceNode.toObject(message.children[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this ThreadNode to JSON.
                 * @function toJSON
                 * @memberof spark.ThreadNode
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ThreadNode.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ThreadNode;
            })();

            return spark;
        })();

        module.exports = $root;

    },{"protobufjs/minimal":9}],2:[function(require,module,exports){
        "use strict";
        module.exports = asPromise;

        /**
         * Callback as used by {@link util.asPromise}.
         * @typedef asPromiseCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {...*} params Additional arguments
         * @returns {undefined}
         */

        /**
         * Returns a promise from a node-style callback function.
         * @memberof util
         * @param {asPromiseCallback} fn Function to call
         * @param {*} ctx Function context
         * @param {...*} params Function arguments
         * @returns {Promise<*>} Promisified function
         */
        function asPromise(fn, ctx/*, varargs */) {
            var params  = new Array(arguments.length - 1),
                offset  = 0,
                index   = 2,
                pending = true;
            while (index < arguments.length)
                params[offset++] = arguments[index++];
            return new Promise(function executor(resolve, reject) {
                params[offset] = function callback(err/*, varargs */) {
                    if (pending) {
                        pending = false;
                        if (err)
                            reject(err);
                        else {
                            var params = new Array(arguments.length - 1),
                                offset = 0;
                            while (offset < params.length)
                                params[offset++] = arguments[offset];
                            resolve.apply(null, params);
                        }
                    }
                };
                try {
                    fn.apply(ctx || null, params);
                } catch (err) {
                    if (pending) {
                        pending = false;
                        reject(err);
                    }
                }
            });
        }

    },{}],3:[function(require,module,exports){
        "use strict";

        /**
         * A minimal base64 implementation for number arrays.
         * @memberof util
         * @namespace
         */
        var base64 = exports;

        /**
         * Calculates the byte length of a base64 encoded string.
         * @param {string} string Base64 encoded string
         * @returns {number} Byte length
         */
        base64.length = function length(string) {
            var p = string.length;
            if (!p)
                return 0;
            var n = 0;
            while (--p % 4 > 1 && string.charAt(p) === "=")
                ++n;
            return Math.ceil(string.length * 3) / 4 - n;
        };

// Base64 encoding table
        var b64 = new Array(64);

// Base64 decoding table
        var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
        for (var i = 0; i < 64;)
            s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

        /**
         * Encodes a buffer to a base64 encoded string.
         * @param {Uint8Array} buffer Source buffer
         * @param {number} start Source start
         * @param {number} end Source end
         * @returns {string} Base64 encoded string
         */
        base64.encode = function encode(buffer, start, end) {
            var parts = null,
                chunk = [];
            var i = 0, // output index
                j = 0, // goto index
                t;     // temporary
            while (start < end) {
                var b = buffer[start++];
                switch (j) {
                    case 0:
                        chunk[i++] = b64[b >> 2];
                        t = (b & 3) << 4;
                        j = 1;
                        break;
                    case 1:
                        chunk[i++] = b64[t | b >> 4];
                        t = (b & 15) << 2;
                        j = 2;
                        break;
                    case 2:
                        chunk[i++] = b64[t | b >> 6];
                        chunk[i++] = b64[b & 63];
                        j = 0;
                        break;
                }
                if (i > 8191) {
                    (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                    i = 0;
                }
            }
            if (j) {
                chunk[i++] = b64[t];
                chunk[i++] = 61;
                if (j === 1)
                    chunk[i++] = 61;
            }
            if (parts) {
                if (i)
                    parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                return parts.join("");
            }
            return String.fromCharCode.apply(String, chunk.slice(0, i));
        };

        var invalidEncoding = "invalid encoding";

        /**
         * Decodes a base64 encoded string to a buffer.
         * @param {string} string Source string
         * @param {Uint8Array} buffer Destination buffer
         * @param {number} offset Destination offset
         * @returns {number} Number of bytes written
         * @throws {Error} If encoding is invalid
         */
        base64.decode = function decode(string, buffer, offset) {
            var start = offset;
            var j = 0, // goto index
                t;     // temporary
            for (var i = 0; i < string.length;) {
                var c = string.charCodeAt(i++);
                if (c === 61 && j > 1)
                    break;
                if ((c = s64[c]) === undefined)
                    throw Error(invalidEncoding);
                switch (j) {
                    case 0:
                        t = c;
                        j = 1;
                        break;
                    case 1:
                        buffer[offset++] = t << 2 | (c & 48) >> 4;
                        t = c;
                        j = 2;
                        break;
                    case 2:
                        buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                        t = c;
                        j = 3;
                        break;
                    case 3:
                        buffer[offset++] = (t & 3) << 6 | c;
                        j = 0;
                        break;
                }
            }
            if (j === 1)
                throw Error(invalidEncoding);
            return offset - start;
        };

        /**
         * Tests if the specified string appears to be base64 encoded.
         * @param {string} string String to test
         * @returns {boolean} `true` if probably base64 encoded, otherwise false
         */
        base64.test = function test(string) {
            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
        };

    },{}],4:[function(require,module,exports){
        "use strict";
        module.exports = EventEmitter;

        /**
         * Constructs a new event emitter instance.
         * @classdesc A minimal event emitter.
         * @memberof util
         * @constructor
         */
        function EventEmitter() {

            /**
             * Registered listeners.
             * @type {Object.<string,*>}
             * @private
             */
            this._listeners = {};
        }

        /**
         * Registers an event listener.
         * @param {string} evt Event name
         * @param {function} fn Listener
         * @param {*} [ctx] Listener context
         * @returns {util.EventEmitter} `this`
         */
        EventEmitter.prototype.on = function on(evt, fn, ctx) {
            (this._listeners[evt] || (this._listeners[evt] = [])).push({
                fn  : fn,
                ctx : ctx || this
            });
            return this;
        };

        /**
         * Removes an event listener or any matching listeners if arguments are omitted.
         * @param {string} [evt] Event name. Removes all listeners if omitted.
         * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
         * @returns {util.EventEmitter} `this`
         */
        EventEmitter.prototype.off = function off(evt, fn) {
            if (evt === undefined)
                this._listeners = {};
            else {
                if (fn === undefined)
                    this._listeners[evt] = [];
                else {
                    var listeners = this._listeners[evt];
                    for (var i = 0; i < listeners.length;)
                        if (listeners[i].fn === fn)
                            listeners.splice(i, 1);
                        else
                            ++i;
                }
            }
            return this;
        };

        /**
         * Emits an event by calling its listeners with the specified arguments.
         * @param {string} evt Event name
         * @param {...*} args Arguments
         * @returns {util.EventEmitter} `this`
         */
        EventEmitter.prototype.emit = function emit(evt) {
            var listeners = this._listeners[evt];
            if (listeners) {
                var args = [],
                    i = 1;
                for (; i < arguments.length;)
                    args.push(arguments[i++]);
                for (i = 0; i < listeners.length;)
                    listeners[i].fn.apply(listeners[i++].ctx, args);
            }
            return this;
        };

    },{}],5:[function(require,module,exports){
        "use strict";

        module.exports = factory(factory);

        /**
         * Reads / writes floats / doubles from / to buffers.
         * @name util.float
         * @namespace
         */

        /**
         * Writes a 32 bit float to a buffer using little endian byte order.
         * @name util.float.writeFloatLE
         * @function
         * @param {number} val Value to write
         * @param {Uint8Array} buf Target buffer
         * @param {number} pos Target buffer offset
         * @returns {undefined}
         */

        /**
         * Writes a 32 bit float to a buffer using big endian byte order.
         * @name util.float.writeFloatBE
         * @function
         * @param {number} val Value to write
         * @param {Uint8Array} buf Target buffer
         * @param {number} pos Target buffer offset
         * @returns {undefined}
         */

        /**
         * Reads a 32 bit float from a buffer using little endian byte order.
         * @name util.float.readFloatLE
         * @function
         * @param {Uint8Array} buf Source buffer
         * @param {number} pos Source buffer offset
         * @returns {number} Value read
         */

        /**
         * Reads a 32 bit float from a buffer using big endian byte order.
         * @name util.float.readFloatBE
         * @function
         * @param {Uint8Array} buf Source buffer
         * @param {number} pos Source buffer offset
         * @returns {number} Value read
         */

        /**
         * Writes a 64 bit double to a buffer using little endian byte order.
         * @name util.float.writeDoubleLE
         * @function
         * @param {number} val Value to write
         * @param {Uint8Array} buf Target buffer
         * @param {number} pos Target buffer offset
         * @returns {undefined}
         */

        /**
         * Writes a 64 bit double to a buffer using big endian byte order.
         * @name util.float.writeDoubleBE
         * @function
         * @param {number} val Value to write
         * @param {Uint8Array} buf Target buffer
         * @param {number} pos Target buffer offset
         * @returns {undefined}
         */

        /**
         * Reads a 64 bit double from a buffer using little endian byte order.
         * @name util.float.readDoubleLE
         * @function
         * @param {Uint8Array} buf Source buffer
         * @param {number} pos Source buffer offset
         * @returns {number} Value read
         */

        /**
         * Reads a 64 bit double from a buffer using big endian byte order.
         * @name util.float.readDoubleBE
         * @function
         * @param {Uint8Array} buf Source buffer
         * @param {number} pos Source buffer offset
         * @returns {number} Value read
         */

// Factory function for the purpose of node-based testing in modified global environments
        function factory(exports) {

            // float: typed array
            if (typeof Float32Array !== "undefined") (function() {

                var f32 = new Float32Array([ -0 ]),
                    f8b = new Uint8Array(f32.buffer),
                    le  = f8b[3] === 128;

                function writeFloat_f32_cpy(val, buf, pos) {
                    f32[0] = val;
                    buf[pos    ] = f8b[0];
                    buf[pos + 1] = f8b[1];
                    buf[pos + 2] = f8b[2];
                    buf[pos + 3] = f8b[3];
                }

                function writeFloat_f32_rev(val, buf, pos) {
                    f32[0] = val;
                    buf[pos    ] = f8b[3];
                    buf[pos + 1] = f8b[2];
                    buf[pos + 2] = f8b[1];
                    buf[pos + 3] = f8b[0];
                }

                /* istanbul ignore next */
                exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
                /* istanbul ignore next */
                exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

                function readFloat_f32_cpy(buf, pos) {
                    f8b[0] = buf[pos    ];
                    f8b[1] = buf[pos + 1];
                    f8b[2] = buf[pos + 2];
                    f8b[3] = buf[pos + 3];
                    return f32[0];
                }

                function readFloat_f32_rev(buf, pos) {
                    f8b[3] = buf[pos    ];
                    f8b[2] = buf[pos + 1];
                    f8b[1] = buf[pos + 2];
                    f8b[0] = buf[pos + 3];
                    return f32[0];
                }

                /* istanbul ignore next */
                exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
                /* istanbul ignore next */
                exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

                // float: ieee754
            })(); else (function() {

                function writeFloat_ieee754(writeUint, val, buf, pos) {
                    var sign = val < 0 ? 1 : 0;
                    if (sign)
                        val = -val;
                    if (val === 0)
                        writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
                    else if (isNaN(val))
                        writeUint(2143289344, buf, pos);
                    else if (val > 3.4028234663852886e+38) // +-Infinity
                        writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
                    else if (val < 1.1754943508222875e-38) // denormal
                        writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
                    else {
                        var exponent = Math.floor(Math.log(val) / Math.LN2),
                            mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                        writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
                    }
                }

                exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
                exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

                function readFloat_ieee754(readUint, buf, pos) {
                    var uint = readUint(buf, pos),
                        sign = (uint >> 31) * 2 + 1,
                        exponent = uint >>> 23 & 255,
                        mantissa = uint & 8388607;
                    return exponent === 255
                        ? mantissa
                            ? NaN
                            : sign * Infinity
                        : exponent === 0 // denormal
                            ? sign * 1.401298464324817e-45 * mantissa
                            : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
                }

                exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
                exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

            })();

            // double: typed array
            if (typeof Float64Array !== "undefined") (function() {

                var f64 = new Float64Array([-0]),
                    f8b = new Uint8Array(f64.buffer),
                    le  = f8b[7] === 128;

                function writeDouble_f64_cpy(val, buf, pos) {
                    f64[0] = val;
                    buf[pos    ] = f8b[0];
                    buf[pos + 1] = f8b[1];
                    buf[pos + 2] = f8b[2];
                    buf[pos + 3] = f8b[3];
                    buf[pos + 4] = f8b[4];
                    buf[pos + 5] = f8b[5];
                    buf[pos + 6] = f8b[6];
                    buf[pos + 7] = f8b[7];
                }

                function writeDouble_f64_rev(val, buf, pos) {
                    f64[0] = val;
                    buf[pos    ] = f8b[7];
                    buf[pos + 1] = f8b[6];
                    buf[pos + 2] = f8b[5];
                    buf[pos + 3] = f8b[4];
                    buf[pos + 4] = f8b[3];
                    buf[pos + 5] = f8b[2];
                    buf[pos + 6] = f8b[1];
                    buf[pos + 7] = f8b[0];
                }

                /* istanbul ignore next */
                exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
                /* istanbul ignore next */
                exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

                function readDouble_f64_cpy(buf, pos) {
                    f8b[0] = buf[pos    ];
                    f8b[1] = buf[pos + 1];
                    f8b[2] = buf[pos + 2];
                    f8b[3] = buf[pos + 3];
                    f8b[4] = buf[pos + 4];
                    f8b[5] = buf[pos + 5];
                    f8b[6] = buf[pos + 6];
                    f8b[7] = buf[pos + 7];
                    return f64[0];
                }

                function readDouble_f64_rev(buf, pos) {
                    f8b[7] = buf[pos    ];
                    f8b[6] = buf[pos + 1];
                    f8b[5] = buf[pos + 2];
                    f8b[4] = buf[pos + 3];
                    f8b[3] = buf[pos + 4];
                    f8b[2] = buf[pos + 5];
                    f8b[1] = buf[pos + 6];
                    f8b[0] = buf[pos + 7];
                    return f64[0];
                }

                /* istanbul ignore next */
                exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
                /* istanbul ignore next */
                exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

                // double: ieee754
            })(); else (function() {

                function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
                    var sign = val < 0 ? 1 : 0;
                    if (sign)
                        val = -val;
                    if (val === 0) {
                        writeUint(0, buf, pos + off0);
                        writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
                    } else if (isNaN(val)) {
                        writeUint(0, buf, pos + off0);
                        writeUint(2146959360, buf, pos + off1);
                    } else if (val > 1.7976931348623157e+308) { // +-Infinity
                        writeUint(0, buf, pos + off0);
                        writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
                    } else {
                        var mantissa;
                        if (val < 2.2250738585072014e-308) { // denormal
                            mantissa = val / 5e-324;
                            writeUint(mantissa >>> 0, buf, pos + off0);
                            writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                        } else {
                            var exponent = Math.floor(Math.log(val) / Math.LN2);
                            if (exponent === 1024)
                                exponent = 1023;
                            mantissa = val * Math.pow(2, -exponent);
                            writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                            writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                        }
                    }
                }

                exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
                exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

                function readDouble_ieee754(readUint, off0, off1, buf, pos) {
                    var lo = readUint(buf, pos + off0),
                        hi = readUint(buf, pos + off1);
                    var sign = (hi >> 31) * 2 + 1,
                        exponent = hi >>> 20 & 2047,
                        mantissa = 4294967296 * (hi & 1048575) + lo;
                    return exponent === 2047
                        ? mantissa
                            ? NaN
                            : sign * Infinity
                        : exponent === 0 // denormal
                            ? sign * 5e-324 * mantissa
                            : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
                }

                exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
                exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

            })();

            return exports;
        }

// uint helpers

        function writeUintLE(val, buf, pos) {
            buf[pos    ] =  val        & 255;
            buf[pos + 1] =  val >>> 8  & 255;
            buf[pos + 2] =  val >>> 16 & 255;
            buf[pos + 3] =  val >>> 24;
        }

        function writeUintBE(val, buf, pos) {
            buf[pos    ] =  val >>> 24;
            buf[pos + 1] =  val >>> 16 & 255;
            buf[pos + 2] =  val >>> 8  & 255;
            buf[pos + 3] =  val        & 255;
        }

        function readUintLE(buf, pos) {
            return (buf[pos    ]
                | buf[pos + 1] << 8
                | buf[pos + 2] << 16
                | buf[pos + 3] << 24) >>> 0;
        }

        function readUintBE(buf, pos) {
            return (buf[pos    ] << 24
                | buf[pos + 1] << 16
                | buf[pos + 2] << 8
                | buf[pos + 3]) >>> 0;
        }

    },{}],6:[function(require,module,exports){
        "use strict";
        module.exports = inquire;

        /**
         * Requires a module only if available.
         * @memberof util
         * @param {string} moduleName Module to require
         * @returns {?Object} Required module if available and not empty, otherwise `null`
         */
        function inquire(moduleName) {
            try {
                var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
                if (mod && (mod.length || Object.keys(mod).length))
                    return mod;
            } catch (e) {} // eslint-disable-line no-empty
            return null;
        }

    },{}],7:[function(require,module,exports){
        "use strict";
        module.exports = pool;

        /**
         * An allocator as used by {@link util.pool}.
         * @typedef PoolAllocator
         * @type {function}
         * @param {number} size Buffer size
         * @returns {Uint8Array} Buffer
         */

        /**
         * A slicer as used by {@link util.pool}.
         * @typedef PoolSlicer
         * @type {function}
         * @param {number} start Start offset
         * @param {number} end End offset
         * @returns {Uint8Array} Buffer slice
         * @this {Uint8Array}
         */

        /**
         * A general purpose buffer pool.
         * @memberof util
         * @function
         * @param {PoolAllocator} alloc Allocator
         * @param {PoolSlicer} slice Slicer
         * @param {number} [size=8192] Slab size
         * @returns {PoolAllocator} Pooled allocator
         */
        function pool(alloc, slice, size) {
            var SIZE   = size || 8192;
            var MAX    = SIZE >>> 1;
            var slab   = null;
            var offset = SIZE;
            return function pool_alloc(size) {
                if (size < 1 || size > MAX)
                    return alloc(size);
                if (offset + size > SIZE) {
                    slab = alloc(SIZE);
                    offset = 0;
                }
                var buf = slice.call(slab, offset, offset += size);
                if (offset & 7) // align to 32 bit
                    offset = (offset | 7) + 1;
                return buf;
            };
        }

    },{}],8:[function(require,module,exports){
        "use strict";

        /**
         * A minimal UTF8 implementation for number arrays.
         * @memberof util
         * @namespace
         */
        var utf8 = exports;

        /**
         * Calculates the UTF8 byte length of a string.
         * @param {string} string String
         * @returns {number} Byte length
         */
        utf8.length = function utf8_length(string) {
            var len = 0,
                c = 0;
            for (var i = 0; i < string.length; ++i) {
                c = string.charCodeAt(i);
                if (c < 128)
                    len += 1;
                else if (c < 2048)
                    len += 2;
                else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
                    ++i;
                    len += 4;
                } else
                    len += 3;
            }
            return len;
        };

        /**
         * Reads UTF8 bytes as a string.
         * @param {Uint8Array} buffer Source buffer
         * @param {number} start Source start
         * @param {number} end Source end
         * @returns {string} String read
         */
        utf8.read = function utf8_read(buffer, start, end) {
            var len = end - start;
            if (len < 1)
                return "";
            var parts = null,
                chunk = [],
                i = 0, // char offset
                t;     // temporary
            while (start < end) {
                t = buffer[start++];
                if (t < 128)
                    chunk[i++] = t;
                else if (t > 191 && t < 224)
                    chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
                else if (t > 239 && t < 365) {
                    t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
                    chunk[i++] = 0xD800 + (t >> 10);
                    chunk[i++] = 0xDC00 + (t & 1023);
                } else
                    chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
                if (i > 8191) {
                    (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                    i = 0;
                }
            }
            if (parts) {
                if (i)
                    parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                return parts.join("");
            }
            return String.fromCharCode.apply(String, chunk.slice(0, i));
        };

        /**
         * Writes a string as UTF8 bytes.
         * @param {string} string Source string
         * @param {Uint8Array} buffer Destination buffer
         * @param {number} offset Destination offset
         * @returns {number} Bytes written
         */
        utf8.write = function utf8_write(string, buffer, offset) {
            var start = offset,
                c1, // character 1
                c2; // character 2
            for (var i = 0; i < string.length; ++i) {
                c1 = string.charCodeAt(i);
                if (c1 < 128) {
                    buffer[offset++] = c1;
                } else if (c1 < 2048) {
                    buffer[offset++] = c1 >> 6       | 192;
                    buffer[offset++] = c1       & 63 | 128;
                } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
                    c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
                    ++i;
                    buffer[offset++] = c1 >> 18      | 240;
                    buffer[offset++] = c1 >> 12 & 63 | 128;
                    buffer[offset++] = c1 >> 6  & 63 | 128;
                    buffer[offset++] = c1       & 63 | 128;
                } else {
                    buffer[offset++] = c1 >> 12      | 224;
                    buffer[offset++] = c1 >> 6  & 63 | 128;
                    buffer[offset++] = c1       & 63 | 128;
                }
            }
            return offset - start;
        };

    },{}],9:[function(require,module,exports){
// minimal library entry point.

        "use strict";
        module.exports = require("./src/index-minimal");

    },{"./src/index-minimal":10}],10:[function(require,module,exports){
        "use strict";
        var protobuf = exports;

        /**
         * Build type, one of `"full"`, `"light"` or `"minimal"`.
         * @name build
         * @type {string}
         * @const
         */
        protobuf.build = "minimal";

// Serialization
        protobuf.Writer       = require("./writer");
        protobuf.BufferWriter = require("./writer_buffer");
        protobuf.Reader       = require("./reader");
        protobuf.BufferReader = require("./reader_buffer");

// Utility
        protobuf.util         = require("./util/minimal");
        protobuf.rpc          = require("./rpc");
        protobuf.roots        = require("./roots");
        protobuf.configure    = configure;

        /* istanbul ignore next */
        /**
         * Reconfigures the library according to the environment.
         * @returns {undefined}
         */
        function configure() {
            protobuf.Reader._configure(protobuf.BufferReader);
            protobuf.util._configure();
        }

// Set up buffer utility according to the environment
        protobuf.Writer._configure(protobuf.BufferWriter);
        configure();

    },{"./reader":11,"./reader_buffer":12,"./roots":13,"./rpc":14,"./util/minimal":17,"./writer":18,"./writer_buffer":19}],11:[function(require,module,exports){
        "use strict";
        module.exports = Reader;

        var util      = require("./util/minimal");

        var BufferReader; // cyclic

        var LongBits  = util.LongBits,
            utf8      = util.utf8;

        /* istanbul ignore next */
        function indexOutOfRange(reader, writeLength) {
            return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
        }

        /**
         * Constructs a new reader instance using the specified buffer.
         * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
         * @constructor
         * @param {Uint8Array} buffer Buffer to read from
         */
        function Reader(buffer) {

            /**
             * Read buffer.
             * @type {Uint8Array}
             */
            this.buf = buffer;

            /**
             * Read buffer position.
             * @type {number}
             */
            this.pos = 0;

            /**
             * Read buffer length.
             * @type {number}
             */
            this.len = buffer.length;
        }

        var create_array = typeof Uint8Array !== "undefined"
            ? function create_typed_array(buffer) {
                if (buffer instanceof Uint8Array || Array.isArray(buffer))
                    return new Reader(buffer);
                throw Error("illegal buffer");
            }
            /* istanbul ignore next */
            : function create_array(buffer) {
                if (Array.isArray(buffer))
                    return new Reader(buffer);
                throw Error("illegal buffer");
            };

        /**
         * Creates a new reader using the specified buffer.
         * @function
         * @param {Uint8Array|Buffer} buffer Buffer to read from
         * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
         * @throws {Error} If `buffer` is not a valid buffer
         */
        Reader.create = util.Buffer
            ? function create_buffer_setup(buffer) {
                return (Reader.create = function create_buffer(buffer) {
                    return util.Buffer.isBuffer(buffer)
                        ? new BufferReader(buffer)
                        /* istanbul ignore next */
                        : create_array(buffer);
                })(buffer);
            }
            /* istanbul ignore next */
            : create_array;

        Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

        /**
         * Reads a varint as an unsigned 32 bit value.
         * @function
         * @returns {number} Value read
         */
        Reader.prototype.uint32 = (function read_uint32_setup() {
            var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
            return function read_uint32() {
                value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
                value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
                value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
                value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
                value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

                /* istanbul ignore if */
                if ((this.pos += 5) > this.len) {
                    this.pos = this.len;
                    throw indexOutOfRange(this, 10);
                }
                return value;
            };
        })();

        /**
         * Reads a varint as a signed 32 bit value.
         * @returns {number} Value read
         */
        Reader.prototype.int32 = function read_int32() {
            return this.uint32() | 0;
        };

        /**
         * Reads a zig-zag encoded varint as a signed 32 bit value.
         * @returns {number} Value read
         */
        Reader.prototype.sint32 = function read_sint32() {
            var value = this.uint32();
            return value >>> 1 ^ -(value & 1) | 0;
        };

        /* eslint-disable no-invalid-this */

        function readLongVarint() {
            // tends to deopt with local vars for octet etc.
            var bits = new LongBits(0, 0);
            var i = 0;
            if (this.len - this.pos > 4) { // fast route (lo)
                for (; i < 4; ++i) {
                    // 1st..4th
                    bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
                    if (this.buf[this.pos++] < 128)
                        return bits;
                }
                // 5th
                bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
                bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
                if (this.buf[this.pos++] < 128)
                    return bits;
                i = 0;
            } else {
                for (; i < 3; ++i) {
                    /* istanbul ignore if */
                    if (this.pos >= this.len)
                        throw indexOutOfRange(this);
                    // 1st..3th
                    bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
                    if (this.buf[this.pos++] < 128)
                        return bits;
                }
                // 4th
                bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
                return bits;
            }
            if (this.len - this.pos > 4) { // fast route (hi)
                for (; i < 5; ++i) {
                    // 6th..10th
                    bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
                    if (this.buf[this.pos++] < 128)
                        return bits;
                }
            } else {
                for (; i < 5; ++i) {
                    /* istanbul ignore if */
                    if (this.pos >= this.len)
                        throw indexOutOfRange(this);
                    // 6th..10th
                    bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
                    if (this.buf[this.pos++] < 128)
                        return bits;
                }
            }
            /* istanbul ignore next */
            throw Error("invalid varint encoding");
        }

        /* eslint-enable no-invalid-this */

        /**
         * Reads a varint as a signed 64 bit value.
         * @name Reader#int64
         * @function
         * @returns {Long} Value read
         */

        /**
         * Reads a varint as an unsigned 64 bit value.
         * @name Reader#uint64
         * @function
         * @returns {Long} Value read
         */

        /**
         * Reads a zig-zag encoded varint as a signed 64 bit value.
         * @name Reader#sint64
         * @function
         * @returns {Long} Value read
         */

        /**
         * Reads a varint as a boolean.
         * @returns {boolean} Value read
         */
        Reader.prototype.bool = function read_bool() {
            return this.uint32() !== 0;
        };

        function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
            return (buf[end - 4]
                | buf[end - 3] << 8
                | buf[end - 2] << 16
                | buf[end - 1] << 24) >>> 0;
        }

        /**
         * Reads fixed 32 bits as an unsigned 32 bit integer.
         * @returns {number} Value read
         */
        Reader.prototype.fixed32 = function read_fixed32() {

            /* istanbul ignore if */
            if (this.pos + 4 > this.len)
                throw indexOutOfRange(this, 4);

            return readFixed32_end(this.buf, this.pos += 4);
        };

        /**
         * Reads fixed 32 bits as a signed 32 bit integer.
         * @returns {number} Value read
         */
        Reader.prototype.sfixed32 = function read_sfixed32() {

            /* istanbul ignore if */
            if (this.pos + 4 > this.len)
                throw indexOutOfRange(this, 4);

            return readFixed32_end(this.buf, this.pos += 4) | 0;
        };

        /* eslint-disable no-invalid-this */

        function readFixed64(/* this: Reader */) {

            /* istanbul ignore if */
            if (this.pos + 8 > this.len)
                throw indexOutOfRange(this, 8);

            return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
        }

        /* eslint-enable no-invalid-this */

        /**
         * Reads fixed 64 bits.
         * @name Reader#fixed64
         * @function
         * @returns {Long} Value read
         */

        /**
         * Reads zig-zag encoded fixed 64 bits.
         * @name Reader#sfixed64
         * @function
         * @returns {Long} Value read
         */

        /**
         * Reads a float (32 bit) as a number.
         * @function
         * @returns {number} Value read
         */
        Reader.prototype.float = function read_float() {

            /* istanbul ignore if */
            if (this.pos + 4 > this.len)
                throw indexOutOfRange(this, 4);

            var value = util.float.readFloatLE(this.buf, this.pos);
            this.pos += 4;
            return value;
        };

        /**
         * Reads a double (64 bit float) as a number.
         * @function
         * @returns {number} Value read
         */
        Reader.prototype.double = function read_double() {

            /* istanbul ignore if */
            if (this.pos + 8 > this.len)
                throw indexOutOfRange(this, 4);

            var value = util.float.readDoubleLE(this.buf, this.pos);
            this.pos += 8;
            return value;
        };

        /**
         * Reads a sequence of bytes preceeded by its length as a varint.
         * @returns {Uint8Array} Value read
         */
        Reader.prototype.bytes = function read_bytes() {
            var length = this.uint32(),
                start  = this.pos,
                end    = this.pos + length;

            /* istanbul ignore if */
            if (end > this.len)
                throw indexOutOfRange(this, length);

            this.pos += length;
            if (Array.isArray(this.buf)) // plain array
                return this.buf.slice(start, end);
            return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
                ? new this.buf.constructor(0)
                : this._slice.call(this.buf, start, end);
        };

        /**
         * Reads a string preceeded by its byte length as a varint.
         * @returns {string} Value read
         */
        Reader.prototype.string = function read_string() {
            var bytes = this.bytes();
            return utf8.read(bytes, 0, bytes.length);
        };

        /**
         * Skips the specified number of bytes if specified, otherwise skips a varint.
         * @param {number} [length] Length if known, otherwise a varint is assumed
         * @returns {Reader} `this`
         */
        Reader.prototype.skip = function skip(length) {
            if (typeof length === "number") {
                /* istanbul ignore if */
                if (this.pos + length > this.len)
                    throw indexOutOfRange(this, length);
                this.pos += length;
            } else {
                do {
                    /* istanbul ignore if */
                    if (this.pos >= this.len)
                        throw indexOutOfRange(this);
                } while (this.buf[this.pos++] & 128);
            }
            return this;
        };

        /**
         * Skips the next element of the specified wire type.
         * @param {number} wireType Wire type received
         * @returns {Reader} `this`
         */
        Reader.prototype.skipType = function(wireType) {
            switch (wireType) {
                case 0:
                    this.skip();
                    break;
                case 1:
                    this.skip(8);
                    break;
                case 2:
                    this.skip(this.uint32());
                    break;
                case 3:
                    while ((wireType = this.uint32() & 7) !== 4) {
                        this.skipType(wireType);
                    }
                    break;
                case 5:
                    this.skip(4);
                    break;

                /* istanbul ignore next */
                default:
                    throw Error("invalid wire type " + wireType + " at offset " + this.pos);
            }
            return this;
        };

        Reader._configure = function(BufferReader_) {
            BufferReader = BufferReader_;

            var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
            util.merge(Reader.prototype, {

                int64: function read_int64() {
                    return readLongVarint.call(this)[fn](false);
                },

                uint64: function read_uint64() {
                    return readLongVarint.call(this)[fn](true);
                },

                sint64: function read_sint64() {
                    return readLongVarint.call(this).zzDecode()[fn](false);
                },

                fixed64: function read_fixed64() {
                    return readFixed64.call(this)[fn](true);
                },

                sfixed64: function read_sfixed64() {
                    return readFixed64.call(this)[fn](false);
                }

            });
        };

    },{"./util/minimal":17}],12:[function(require,module,exports){
        "use strict";
        module.exports = BufferReader;

// extends Reader
        var Reader = require("./reader");
        (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

        var util = require("./util/minimal");

        /**
         * Constructs a new buffer reader instance.
         * @classdesc Wire format reader using node buffers.
         * @extends Reader
         * @constructor
         * @param {Buffer} buffer Buffer to read from
         */
        function BufferReader(buffer) {
            Reader.call(this, buffer);

            /**
             * Read buffer.
             * @name BufferReader#buf
             * @type {Buffer}
             */
        }

        /* istanbul ignore else */
        if (util.Buffer)
            BufferReader.prototype._slice = util.Buffer.prototype.slice;

        /**
         * @override
         */
        BufferReader.prototype.string = function read_string_buffer() {
            var len = this.uint32(); // modifies pos
            return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
        };

        /**
         * Reads a sequence of bytes preceeded by its length as a varint.
         * @name BufferReader#bytes
         * @function
         * @returns {Buffer} Value read
         */

    },{"./reader":11,"./util/minimal":17}],13:[function(require,module,exports){
        "use strict";
        module.exports = {};

        /**
         * Named roots.
         * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
         * Can also be used manually to make roots available accross modules.
         * @name roots
         * @type {Object.<string,Root>}
         * @example
         * // pbjs -r myroot -o compiled.js ...
         *
         * // in another module:
         * require("./compiled.js");
         *
         * // in any subsequent module:
         * var root = protobuf.roots["myroot"];
         */

    },{}],14:[function(require,module,exports){
        "use strict";

        /**
         * Streaming RPC helpers.
         * @namespace
         */
        var rpc = exports;

        /**
         * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
         * @typedef RPCImpl
         * @type {function}
         * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
         * @param {Uint8Array} requestData Request data
         * @param {RPCImplCallback} callback Callback function
         * @returns {undefined}
         * @example
         * function rpcImpl(method, requestData, callback) {
         *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
         *         throw Error("no such method");
         *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
         *         callback(err, responseData);
         *     });
         * }
         */

        /**
         * Node-style callback as used by {@link RPCImpl}.
         * @typedef RPCImplCallback
         * @type {function}
         * @param {Error|null} error Error, if any, otherwise `null`
         * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
         * @returns {undefined}
         */

        rpc.Service = require("./rpc/service");

    },{"./rpc/service":15}],15:[function(require,module,exports){
        "use strict";
        module.exports = Service;

        var util = require("../util/minimal");

// Extends EventEmitter
        (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

        /**
         * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
         *
         * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
         * @typedef rpc.ServiceMethodCallback
         * @template TRes extends Message<TRes>
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {TRes} [response] Response message
         * @returns {undefined}
         */

        /**
         * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
         * @typedef rpc.ServiceMethod
         * @template TReq extends Message<TReq>
         * @template TRes extends Message<TRes>
         * @type {function}
         * @param {TReq|Properties<TReq>} request Request message or plain object
         * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
         * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
         */

        /**
         * Constructs a new RPC service instance.
         * @classdesc An RPC service as returned by {@link Service#create}.
         * @exports rpc.Service
         * @extends util.EventEmitter
         * @constructor
         * @param {RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Service(rpcImpl, requestDelimited, responseDelimited) {

            if (typeof rpcImpl !== "function")
                throw TypeError("rpcImpl must be a function");

            util.EventEmitter.call(this);

            /**
             * RPC implementation. Becomes `null` once the service is ended.
             * @type {RPCImpl|null}
             */
            this.rpcImpl = rpcImpl;

            /**
             * Whether requests are length-delimited.
             * @type {boolean}
             */
            this.requestDelimited = Boolean(requestDelimited);

            /**
             * Whether responses are length-delimited.
             * @type {boolean}
             */
            this.responseDelimited = Boolean(responseDelimited);
        }

        /**
         * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
         * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
         * @param {Constructor<TReq>} requestCtor Request constructor
         * @param {Constructor<TRes>} responseCtor Response constructor
         * @param {TReq|Properties<TReq>} request Request message or plain object
         * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
         * @returns {undefined}
         * @template TReq extends Message<TReq>
         * @template TRes extends Message<TRes>
         */
        Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

            if (!request)
                throw TypeError("request must be specified");

            var self = this;
            if (!callback)
                return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

            if (!self.rpcImpl) {
                setTimeout(function() { callback(Error("already ended")); }, 0);
                return undefined;
            }

            try {
                return self.rpcImpl(
                    method,
                    requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
                    function rpcCallback(err, response) {

                        if (err) {
                            self.emit("error", err, method);
                            return callback(err);
                        }

                        if (response === null) {
                            self.end(/* endedByRPC */ true);
                            return undefined;
                        }

                        if (!(response instanceof responseCtor)) {
                            try {
                                response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                            } catch (err) {
                                self.emit("error", err, method);
                                return callback(err);
                            }
                        }

                        self.emit("data", response, method);
                        return callback(null, response);
                    }
                );
            } catch (err) {
                self.emit("error", err, method);
                setTimeout(function() { callback(err); }, 0);
                return undefined;
            }
        };

        /**
         * Ends this service and emits the `end` event.
         * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
         * @returns {rpc.Service} `this`
         */
        Service.prototype.end = function end(endedByRPC) {
            if (this.rpcImpl) {
                if (!endedByRPC) // signal end to rpcImpl
                    this.rpcImpl(null, null, null);
                this.rpcImpl = null;
                this.emit("end").off();
            }
            return this;
        };

    },{"../util/minimal":17}],16:[function(require,module,exports){
        "use strict";
        module.exports = LongBits;

        var util = require("../util/minimal");

        /**
         * Constructs new long bits.
         * @classdesc Helper class for working with the low and high bits of a 64 bit value.
         * @memberof util
         * @constructor
         * @param {number} lo Low 32 bits, unsigned
         * @param {number} hi High 32 bits, unsigned
         */
        function LongBits(lo, hi) {

            // note that the casts below are theoretically unnecessary as of today, but older statically
            // generated converter code might still call the ctor with signed 32bits. kept for compat.

            /**
             * Low bits.
             * @type {number}
             */
            this.lo = lo >>> 0;

            /**
             * High bits.
             * @type {number}
             */
            this.hi = hi >>> 0;
        }

        /**
         * Zero bits.
         * @memberof util.LongBits
         * @type {util.LongBits}
         */
        var zero = LongBits.zero = new LongBits(0, 0);

        zero.toNumber = function() { return 0; };
        zero.zzEncode = zero.zzDecode = function() { return this; };
        zero.length = function() { return 1; };

        /**
         * Zero hash.
         * @memberof util.LongBits
         * @type {string}
         */
        var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

        /**
         * Constructs new long bits from the specified number.
         * @param {number} value Value
         * @returns {util.LongBits} Instance
         */
        LongBits.fromNumber = function fromNumber(value) {
            if (value === 0)
                return zero;
            var sign = value < 0;
            if (sign)
                value = -value;
            var lo = value >>> 0,
                hi = (value - lo) / 4294967296 >>> 0;
            if (sign) {
                hi = ~hi >>> 0;
                lo = ~lo >>> 0;
                if (++lo > 4294967295) {
                    lo = 0;
                    if (++hi > 4294967295)
                        hi = 0;
                }
            }
            return new LongBits(lo, hi);
        };

        /**
         * Constructs new long bits from a number, long or string.
         * @param {Long|number|string} value Value
         * @returns {util.LongBits} Instance
         */
        LongBits.from = function from(value) {
            if (typeof value === "number")
                return LongBits.fromNumber(value);
            if (util.isString(value)) {
                /* istanbul ignore else */
                if (util.Long)
                    value = util.Long.fromString(value);
                else
                    return LongBits.fromNumber(parseInt(value, 10));
            }
            return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
        };

        /**
         * Converts this long bits to a possibly unsafe JavaScript number.
         * @param {boolean} [unsigned=false] Whether unsigned or not
         * @returns {number} Possibly unsafe number
         */
        LongBits.prototype.toNumber = function toNumber(unsigned) {
            if (!unsigned && this.hi >>> 31) {
                var lo = ~this.lo + 1 >>> 0,
                    hi = ~this.hi     >>> 0;
                if (!lo)
                    hi = hi + 1 >>> 0;
                return -(lo + hi * 4294967296);
            }
            return this.lo + this.hi * 4294967296;
        };

        /**
         * Converts this long bits to a long.
         * @param {boolean} [unsigned=false] Whether unsigned or not
         * @returns {Long} Long
         */
        LongBits.prototype.toLong = function toLong(unsigned) {
            return util.Long
                ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
                /* istanbul ignore next */
                : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
        };

        var charCodeAt = String.prototype.charCodeAt;

        /**
         * Constructs new long bits from the specified 8 characters long hash.
         * @param {string} hash Hash
         * @returns {util.LongBits} Bits
         */
        LongBits.fromHash = function fromHash(hash) {
            if (hash === zeroHash)
                return zero;
            return new LongBits(
                ( charCodeAt.call(hash, 0)
                    | charCodeAt.call(hash, 1) << 8
                    | charCodeAt.call(hash, 2) << 16
                    | charCodeAt.call(hash, 3) << 24) >>> 0
                ,
                ( charCodeAt.call(hash, 4)
                    | charCodeAt.call(hash, 5) << 8
                    | charCodeAt.call(hash, 6) << 16
                    | charCodeAt.call(hash, 7) << 24) >>> 0
            );
        };

        /**
         * Converts this long bits to a 8 characters long hash.
         * @returns {string} Hash
         */
        LongBits.prototype.toHash = function toHash() {
            return String.fromCharCode(
                this.lo        & 255,
                this.lo >>> 8  & 255,
                this.lo >>> 16 & 255,
                this.lo >>> 24      ,
                this.hi        & 255,
                this.hi >>> 8  & 255,
                this.hi >>> 16 & 255,
                this.hi >>> 24
            );
        };

        /**
         * Zig-zag encodes this long bits.
         * @returns {util.LongBits} `this`
         */
        LongBits.prototype.zzEncode = function zzEncode() {
            var mask =   this.hi >> 31;
            this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
            this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
            return this;
        };

        /**
         * Zig-zag decodes this long bits.
         * @returns {util.LongBits} `this`
         */
        LongBits.prototype.zzDecode = function zzDecode() {
            var mask = -(this.lo & 1);
            this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
            this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
            return this;
        };

        /**
         * Calculates the length of this longbits when encoded as a varint.
         * @returns {number} Length
         */
        LongBits.prototype.length = function length() {
            var part0 =  this.lo,
                part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
                part2 =  this.hi >>> 24;
            return part2 === 0
                ? part1 === 0
                    ? part0 < 16384
                        ? part0 < 128 ? 1 : 2
                        : part0 < 2097152 ? 3 : 4
                    : part1 < 16384
                        ? part1 < 128 ? 5 : 6
                        : part1 < 2097152 ? 7 : 8
                : part2 < 128 ? 9 : 10;
        };

    },{"../util/minimal":17}],17:[function(require,module,exports){
        (function (global){
            "use strict";
            var util = exports;

// used to return a Promise where callback is omitted
            util.asPromise = require("@protobufjs/aspromise");

// converts to / from base64 encoded strings
            util.base64 = require("@protobufjs/base64");

// base class of rpc.Service
            util.EventEmitter = require("@protobufjs/eventemitter");

// float handling accross browsers
            util.float = require("@protobufjs/float");

// requires modules optionally and hides the call from bundlers
            util.inquire = require("@protobufjs/inquire");

// converts to / from utf8 encoded strings
            util.utf8 = require("@protobufjs/utf8");

// provides a node-like buffer pool in the browser
            util.pool = require("@protobufjs/pool");

// utility to work with the low and high bits of a 64 bit value
            util.LongBits = require("./longbits");

// global object reference
            util.global = typeof window !== "undefined" && window
                || typeof global !== "undefined" && global
                || typeof self   !== "undefined" && self
                || this; // eslint-disable-line no-invalid-this

            /**
             * An immuable empty array.
             * @memberof util
             * @type {Array.<*>}
             * @const
             */
            util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

            /**
             * An immutable empty object.
             * @type {Object}
             * @const
             */
            util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

            /**
             * Whether running within node or not.
             * @memberof util
             * @type {boolean}
             * @const
             */
            util.isNode = Boolean(util.global.process && util.global.process.versions && util.global.process.versions.node);

            /**
             * Tests if the specified value is an integer.
             * @function
             * @param {*} value Value to test
             * @returns {boolean} `true` if the value is an integer
             */
            util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
                return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
            };

            /**
             * Tests if the specified value is a string.
             * @param {*} value Value to test
             * @returns {boolean} `true` if the value is a string
             */
            util.isString = function isString(value) {
                return typeof value === "string" || value instanceof String;
            };

            /**
             * Tests if the specified value is a non-null object.
             * @param {*} value Value to test
             * @returns {boolean} `true` if the value is a non-null object
             */
            util.isObject = function isObject(value) {
                return value && typeof value === "object";
            };

            /**
             * Checks if a property on a message is considered to be present.
             * This is an alias of {@link util.isSet}.
             * @function
             * @param {Object} obj Plain object or message instance
             * @param {string} prop Property name
             * @returns {boolean} `true` if considered to be present, otherwise `false`
             */
            util.isset =

                /**
                 * Checks if a property on a message is considered to be present.
                 * @param {Object} obj Plain object or message instance
                 * @param {string} prop Property name
                 * @returns {boolean} `true` if considered to be present, otherwise `false`
                 */
                util.isSet = function isSet(obj, prop) {
                    var value = obj[prop];
                    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
                        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
                    return false;
                };

            /**
             * Any compatible Buffer instance.
             * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
             * @interface Buffer
             * @extends Uint8Array
             */

            /**
             * Node's Buffer class if available.
             * @type {Constructor<Buffer>}
             */
            util.Buffer = (function() {
                try {
                    var Buffer = util.inquire("buffer").Buffer;
                    // refuse to use non-node buffers if not explicitly assigned (perf reasons):
                    return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
                } catch (e) {
                    /* istanbul ignore next */
                    return null;
                }
            })();

// Internal alias of or polyfull for Buffer.from.
            util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
            util._Buffer_allocUnsafe = null;

            /**
             * Creates a new buffer of whatever type supported by the environment.
             * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
             * @returns {Uint8Array|Buffer} Buffer
             */
            util.newBuffer = function newBuffer(sizeOrArray) {
                /* istanbul ignore next */
                return typeof sizeOrArray === "number"
                    ? util.Buffer
                        ? util._Buffer_allocUnsafe(sizeOrArray)
                        : new util.Array(sizeOrArray)
                    : util.Buffer
                        ? util._Buffer_from(sizeOrArray)
                        : typeof Uint8Array === "undefined"
                            ? sizeOrArray
                            : new Uint8Array(sizeOrArray);
            };

            /**
             * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
             * @type {Constructor<Uint8Array>}
             */
            util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

            /**
             * Any compatible Long instance.
             * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
             * @interface Long
             * @property {number} low Low bits
             * @property {number} high High bits
             * @property {boolean} unsigned Whether unsigned or not
             */

            /**
             * Long.js's Long class if available.
             * @type {Constructor<Long>}
             */
            util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
                || /* istanbul ignore next */ util.global.Long
                || util.inquire("long");

            /**
             * Regular expression used to verify 2 bit (`bool`) map keys.
             * @type {RegExp}
             * @const
             */
            util.key2Re = /^true|false|0|1$/;

            /**
             * Regular expression used to verify 32 bit (`int32` etc.) map keys.
             * @type {RegExp}
             * @const
             */
            util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

            /**
             * Regular expression used to verify 64 bit (`int64` etc.) map keys.
             * @type {RegExp}
             * @const
             */
            util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

            /**
             * Converts a number or long to an 8 characters long hash string.
             * @param {Long|number} value Value to convert
             * @returns {string} Hash
             */
            util.longToHash = function longToHash(value) {
                return value
                    ? util.LongBits.from(value).toHash()
                    : util.LongBits.zeroHash;
            };

            /**
             * Converts an 8 characters long hash string to a long or number.
             * @param {string} hash Hash
             * @param {boolean} [unsigned=false] Whether unsigned or not
             * @returns {Long|number} Original value
             */
            util.longFromHash = function longFromHash(hash, unsigned) {
                var bits = util.LongBits.fromHash(hash);
                if (util.Long)
                    return util.Long.fromBits(bits.lo, bits.hi, unsigned);
                return bits.toNumber(Boolean(unsigned));
            };

            /**
             * Merges the properties of the source object into the destination object.
             * @memberof util
             * @param {Object.<string,*>} dst Destination object
             * @param {Object.<string,*>} src Source object
             * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
             * @returns {Object.<string,*>} Destination object
             */
            function merge(dst, src, ifNotSet) { // used by converters
                for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
                    if (dst[keys[i]] === undefined || !ifNotSet)
                        dst[keys[i]] = src[keys[i]];
                return dst;
            }

            util.merge = merge;

            /**
             * Converts the first character of a string to lower case.
             * @param {string} str String to convert
             * @returns {string} Converted string
             */
            util.lcFirst = function lcFirst(str) {
                return str.charAt(0).toLowerCase() + str.substring(1);
            };

            /**
             * Creates a custom error constructor.
             * @memberof util
             * @param {string} name Error name
             * @returns {Constructor<Error>} Custom error constructor
             */
            function newError(name) {

                function CustomError(message, properties) {

                    if (!(this instanceof CustomError))
                        return new CustomError(message, properties);

                    // Error.call(this, message);
                    // ^ just returns a new error instance because the ctor can be called as a function

                    Object.defineProperty(this, "message", { get: function() { return message; } });

                    /* istanbul ignore next */
                    if (Error.captureStackTrace) // node
                        Error.captureStackTrace(this, CustomError);
                    else
                        Object.defineProperty(this, "stack", { value: (new Error()).stack || "" });

                    if (properties)
                        merge(this, properties);
                }

                (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

                Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

                CustomError.prototype.toString = function toString() {
                    return this.name + ": " + this.message;
                };

                return CustomError;
            }

            util.newError = newError;

            /**
             * Constructs a new protocol error.
             * @classdesc Error subclass indicating a protocol specifc error.
             * @memberof util
             * @extends Error
             * @template T extends Message<T>
             * @constructor
             * @param {string} message Error message
             * @param {Object.<string,*>} [properties] Additional properties
             * @example
             * try {
             *     MyMessage.decode(someBuffer); // throws if required fields are missing
             * } catch (e) {
             *     if (e instanceof ProtocolError && e.instance)
             *         console.log("decoded so far: " + JSON.stringify(e.instance));
             * }
             */
            util.ProtocolError = newError("ProtocolError");

            /**
             * So far decoded message instance.
             * @name util.ProtocolError#instance
             * @type {Message<T>}
             */

            /**
             * A OneOf getter as returned by {@link util.oneOfGetter}.
             * @typedef OneOfGetter
             * @type {function}
             * @returns {string|undefined} Set field name, if any
             */

            /**
             * Builds a getter for a oneof's present field name.
             * @param {string[]} fieldNames Field names
             * @returns {OneOfGetter} Unbound getter
             */
            util.oneOfGetter = function getOneOf(fieldNames) {
                var fieldMap = {};
                for (var i = 0; i < fieldNames.length; ++i)
                    fieldMap[fieldNames[i]] = 1;

                /**
                 * @returns {string|undefined} Set field name, if any
                 * @this Object
                 * @ignore
                 */
                return function() { // eslint-disable-line consistent-return
                    for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
                        if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                            return keys[i];
                };
            };

            /**
             * A OneOf setter as returned by {@link util.oneOfSetter}.
             * @typedef OneOfSetter
             * @type {function}
             * @param {string|undefined} value Field name
             * @returns {undefined}
             */

            /**
             * Builds a setter for a oneof's present field name.
             * @param {string[]} fieldNames Field names
             * @returns {OneOfSetter} Unbound setter
             */
            util.oneOfSetter = function setOneOf(fieldNames) {

                /**
                 * @param {string} name Field name
                 * @returns {undefined}
                 * @this Object
                 * @ignore
                 */
                return function(name) {
                    for (var i = 0; i < fieldNames.length; ++i)
                        if (fieldNames[i] !== name)
                            delete this[fieldNames[i]];
                };
            };

            /**
             * Default conversion options used for {@link Message#toJSON} implementations.
             *
             * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
             *
             * - Longs become strings
             * - Enums become string keys
             * - Bytes become base64 encoded strings
             * - (Sub-)Messages become plain objects
             * - Maps become plain objects with all string keys
             * - Repeated fields become arrays
             * - NaN and Infinity for float and double fields become strings
             *
             * @type {IConversionOptions}
             * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
             */
            util.toJSONOptions = {
                longs: String,
                enums: String,
                bytes: String,
                json: true
            };

// Sets up buffer utility according to the environment (called in index-minimal)
            util._configure = function() {
                var Buffer = util.Buffer;
                /* istanbul ignore if */
                if (!Buffer) {
                    util._Buffer_from = util._Buffer_allocUnsafe = null;
                    return;
                }
                // because node 4.x buffers are incompatible & immutable
                // see: https://github.com/dcodeIO/protobuf.js/pull/665
                util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
                    /* istanbul ignore next */
                    function Buffer_from(value, encoding) {
                        return new Buffer(value, encoding);
                    };
                util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
                    /* istanbul ignore next */
                    function Buffer_allocUnsafe(size) {
                        return new Buffer(size);
                    };
            };

        }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"./longbits":16,"@protobufjs/aspromise":2,"@protobufjs/base64":3,"@protobufjs/eventemitter":4,"@protobufjs/float":5,"@protobufjs/inquire":6,"@protobufjs/pool":7,"@protobufjs/utf8":8}],18:[function(require,module,exports){
        "use strict";
        module.exports = Writer;

        var util      = require("./util/minimal");

        var BufferWriter; // cyclic

        var LongBits  = util.LongBits,
            base64    = util.base64,
            utf8      = util.utf8;

        /**
         * Constructs a new writer operation instance.
         * @classdesc Scheduled writer operation.
         * @constructor
         * @param {function(*, Uint8Array, number)} fn Function to call
         * @param {number} len Value byte length
         * @param {*} val Value to write
         * @ignore
         */
        function Op(fn, len, val) {

            /**
             * Function to call.
             * @type {function(Uint8Array, number, *)}
             */
            this.fn = fn;

            /**
             * Value byte length.
             * @type {number}
             */
            this.len = len;

            /**
             * Next operation.
             * @type {Writer.Op|undefined}
             */
            this.next = undefined;

            /**
             * Value to write.
             * @type {*}
             */
            this.val = val; // type varies
        }

        /* istanbul ignore next */
        function noop() {} // eslint-disable-line no-empty-function

        /**
         * Constructs a new writer state instance.
         * @classdesc Copied writer state.
         * @memberof Writer
         * @constructor
         * @param {Writer} writer Writer to copy state from
         * @ignore
         */
        function State(writer) {

            /**
             * Current head.
             * @type {Writer.Op}
             */
            this.head = writer.head;

            /**
             * Current tail.
             * @type {Writer.Op}
             */
            this.tail = writer.tail;

            /**
             * Current buffer length.
             * @type {number}
             */
            this.len = writer.len;

            /**
             * Next state.
             * @type {State|null}
             */
            this.next = writer.states;
        }

        /**
         * Constructs a new writer instance.
         * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
         * @constructor
         */
        function Writer() {

            /**
             * Current length.
             * @type {number}
             */
            this.len = 0;

            /**
             * Operations head.
             * @type {Object}
             */
            this.head = new Op(noop, 0, 0);

            /**
             * Operations tail
             * @type {Object}
             */
            this.tail = this.head;

            /**
             * Linked forked states.
             * @type {Object|null}
             */
            this.states = null;

            // When a value is written, the writer calculates its byte length and puts it into a linked
            // list of operations to perform when finish() is called. This both allows us to allocate
            // buffers of the exact required size and reduces the amount of work we have to do compared
            // to first calculating over objects and then encoding over objects. In our case, the encoding
            // part is just a linked list walk calling operations with already prepared values.
        }

        /**
         * Creates a new writer.
         * @function
         * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
         */
        Writer.create = util.Buffer
            ? function create_buffer_setup() {
                return (Writer.create = function create_buffer() {
                    return new BufferWriter();
                })();
            }
            /* istanbul ignore next */
            : function create_array() {
                return new Writer();
            };

        /**
         * Allocates a buffer of the specified size.
         * @param {number} size Buffer size
         * @returns {Uint8Array} Buffer
         */
        Writer.alloc = function alloc(size) {
            return new util.Array(size);
        };

// Use Uint8Array buffer pool in the browser, just like node does with buffers
        /* istanbul ignore else */
        if (util.Array !== Array)
            Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

        /**
         * Pushes a new operation to the queue.
         * @param {function(Uint8Array, number, *)} fn Function to call
         * @param {number} len Value byte length
         * @param {number} val Value to write
         * @returns {Writer} `this`
         * @private
         */
        Writer.prototype._push = function push(fn, len, val) {
            this.tail = this.tail.next = new Op(fn, len, val);
            this.len += len;
            return this;
        };

        function writeByte(val, buf, pos) {
            buf[pos] = val & 255;
        }

        function writeVarint32(val, buf, pos) {
            while (val > 127) {
                buf[pos++] = val & 127 | 128;
                val >>>= 7;
            }
            buf[pos] = val;
        }

        /**
         * Constructs a new varint writer operation instance.
         * @classdesc Scheduled varint writer operation.
         * @extends Op
         * @constructor
         * @param {number} len Value byte length
         * @param {number} val Value to write
         * @ignore
         */
        function VarintOp(len, val) {
            this.len = len;
            this.next = undefined;
            this.val = val;
        }

        VarintOp.prototype = Object.create(Op.prototype);
        VarintOp.prototype.fn = writeVarint32;

        /**
         * Writes an unsigned 32 bit value as a varint.
         * @param {number} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.uint32 = function write_uint32(value) {
            // here, the call to this.push has been inlined and a varint specific Op subclass is used.
            // uint32 is by far the most frequently used operation and benefits significantly from this.
            this.len += (this.tail = this.tail.next = new VarintOp(
                (value = value >>> 0)
                < 128       ? 1
                    : value < 16384     ? 2
                    : value < 2097152   ? 3
                        : value < 268435456 ? 4
                            :                     5,
                value)).len;
            return this;
        };

        /**
         * Writes a signed 32 bit value as a varint.
         * @function
         * @param {number} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.int32 = function write_int32(value) {
            return value < 0
                ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
                : this.uint32(value);
        };

        /**
         * Writes a 32 bit value as a varint, zig-zag encoded.
         * @param {number} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.sint32 = function write_sint32(value) {
            return this.uint32((value << 1 ^ value >> 31) >>> 0);
        };

        function writeVarint64(val, buf, pos) {
            while (val.hi) {
                buf[pos++] = val.lo & 127 | 128;
                val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
                val.hi >>>= 7;
            }
            while (val.lo > 127) {
                buf[pos++] = val.lo & 127 | 128;
                val.lo = val.lo >>> 7;
            }
            buf[pos++] = val.lo;
        }

        /**
         * Writes an unsigned 64 bit value as a varint.
         * @param {Long|number|string} value Value to write
         * @returns {Writer} `this`
         * @throws {TypeError} If `value` is a string and no long library is present.
         */
        Writer.prototype.uint64 = function write_uint64(value) {
            var bits = LongBits.from(value);
            return this._push(writeVarint64, bits.length(), bits);
        };

        /**
         * Writes a signed 64 bit value as a varint.
         * @function
         * @param {Long|number|string} value Value to write
         * @returns {Writer} `this`
         * @throws {TypeError} If `value` is a string and no long library is present.
         */
        Writer.prototype.int64 = Writer.prototype.uint64;

        /**
         * Writes a signed 64 bit value as a varint, zig-zag encoded.
         * @param {Long|number|string} value Value to write
         * @returns {Writer} `this`
         * @throws {TypeError} If `value` is a string and no long library is present.
         */
        Writer.prototype.sint64 = function write_sint64(value) {
            var bits = LongBits.from(value).zzEncode();
            return this._push(writeVarint64, bits.length(), bits);
        };

        /**
         * Writes a boolish value as a varint.
         * @param {boolean} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.bool = function write_bool(value) {
            return this._push(writeByte, 1, value ? 1 : 0);
        };

        function writeFixed32(val, buf, pos) {
            buf[pos    ] =  val         & 255;
            buf[pos + 1] =  val >>> 8   & 255;
            buf[pos + 2] =  val >>> 16  & 255;
            buf[pos + 3] =  val >>> 24;
        }

        /**
         * Writes an unsigned 32 bit value as fixed 32 bits.
         * @param {number} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.fixed32 = function write_fixed32(value) {
            return this._push(writeFixed32, 4, value >>> 0);
        };

        /**
         * Writes a signed 32 bit value as fixed 32 bits.
         * @function
         * @param {number} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.sfixed32 = Writer.prototype.fixed32;

        /**
         * Writes an unsigned 64 bit value as fixed 64 bits.
         * @param {Long|number|string} value Value to write
         * @returns {Writer} `this`
         * @throws {TypeError} If `value` is a string and no long library is present.
         */
        Writer.prototype.fixed64 = function write_fixed64(value) {
            var bits = LongBits.from(value);
            return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
        };

        /**
         * Writes a signed 64 bit value as fixed 64 bits.
         * @function
         * @param {Long|number|string} value Value to write
         * @returns {Writer} `this`
         * @throws {TypeError} If `value` is a string and no long library is present.
         */
        Writer.prototype.sfixed64 = Writer.prototype.fixed64;

        /**
         * Writes a float (32 bit).
         * @function
         * @param {number} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.float = function write_float(value) {
            return this._push(util.float.writeFloatLE, 4, value);
        };

        /**
         * Writes a double (64 bit float).
         * @function
         * @param {number} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.double = function write_double(value) {
            return this._push(util.float.writeDoubleLE, 8, value);
        };

        var writeBytes = util.Array.prototype.set
            ? function writeBytes_set(val, buf, pos) {
                buf.set(val, pos); // also works for plain array values
            }
            /* istanbul ignore next */
            : function writeBytes_for(val, buf, pos) {
                for (var i = 0; i < val.length; ++i)
                    buf[pos + i] = val[i];
            };

        /**
         * Writes a sequence of bytes.
         * @param {Uint8Array|string} value Buffer or base64 encoded string to write
         * @returns {Writer} `this`
         */
        Writer.prototype.bytes = function write_bytes(value) {
            var len = value.length >>> 0;
            if (!len)
                return this._push(writeByte, 1, 0);
            if (util.isString(value)) {
                var buf = Writer.alloc(len = base64.length(value));
                base64.decode(value, buf, 0);
                value = buf;
            }
            return this.uint32(len)._push(writeBytes, len, value);
        };

        /**
         * Writes a string.
         * @param {string} value Value to write
         * @returns {Writer} `this`
         */
        Writer.prototype.string = function write_string(value) {
            var len = utf8.length(value);
            return len
                ? this.uint32(len)._push(utf8.write, len, value)
                : this._push(writeByte, 1, 0);
        };

        /**
         * Forks this writer's state by pushing it to a stack.
         * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
         * @returns {Writer} `this`
         */
        Writer.prototype.fork = function fork() {
            this.states = new State(this);
            this.head = this.tail = new Op(noop, 0, 0);
            this.len = 0;
            return this;
        };

        /**
         * Resets this instance to the last state.
         * @returns {Writer} `this`
         */
        Writer.prototype.reset = function reset() {
            if (this.states) {
                this.head   = this.states.head;
                this.tail   = this.states.tail;
                this.len    = this.states.len;
                this.states = this.states.next;
            } else {
                this.head = this.tail = new Op(noop, 0, 0);
                this.len  = 0;
            }
            return this;
        };

        /**
         * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
         * @returns {Writer} `this`
         */
        Writer.prototype.ldelim = function ldelim() {
            var head = this.head,
                tail = this.tail,
                len  = this.len;
            this.reset().uint32(len);
            if (len) {
                this.tail.next = head.next; // skip noop
                this.tail = tail;
                this.len += len;
            }
            return this;
        };

        /**
         * Finishes the write operation.
         * @returns {Uint8Array} Finished buffer
         */
        Writer.prototype.finish = function finish() {
            var head = this.head.next, // skip noop
                buf  = this.constructor.alloc(this.len),
                pos  = 0;
            while (head) {
                head.fn(head.val, buf, pos);
                pos += head.len;
                head = head.next;
            }
            // this.head = this.tail = null;
            return buf;
        };

        Writer._configure = function(BufferWriter_) {
            BufferWriter = BufferWriter_;
        };

    },{"./util/minimal":17}],19:[function(require,module,exports){
        "use strict";
        module.exports = BufferWriter;

// extends Writer
        var Writer = require("./writer");
        (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

        var util = require("./util/minimal");

        var Buffer = util.Buffer;

        /**
         * Constructs a new buffer writer instance.
         * @classdesc Wire format writer using node buffers.
         * @extends Writer
         * @constructor
         */
        function BufferWriter() {
            Writer.call(this);
        }

        /**
         * Allocates a buffer of the specified size.
         * @param {number} size Buffer size
         * @returns {Buffer} Buffer
         */
        BufferWriter.alloc = function alloc_buffer(size) {
            return (BufferWriter.alloc = util._Buffer_allocUnsafe)(size);
        };

        var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set"
            ? function writeBytesBuffer_set(val, buf, pos) {
                buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
                                   // also works for plain array values
            }
            /* istanbul ignore next */
            : function writeBytesBuffer_copy(val, buf, pos) {
                if (val.copy) // Buffer values
                    val.copy(buf, pos, 0, val.length);
                else for (var i = 0; i < val.length;) // plain array values
                    buf[pos++] = val[i++];
            };

        /**
         * @override
         */
        BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
            if (util.isString(value))
                value = util._Buffer_from(value, "base64");
            var len = value.length >>> 0;
            this.uint32(len);
            if (len)
                this._push(writeBytesBuffer, len, value);
            return this;
        };

        function writeStringBuffer(val, buf, pos) {
            if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
                util.utf8.write(val, buf, pos);
            else
                buf.utf8Write(val, pos);
        }

        /**
         * @override
         */
        BufferWriter.prototype.string = function write_string_buffer(value) {
            var len = Buffer.byteLength(value);
            this.uint32(len);
            if (len)
                this._push(writeStringBuffer, len, value);
            return this;
        };


        /**
         * Finishes the write operation.
         * @name BufferWriter#finish
         * @function
         * @returns {Buffer} Finished buffer
         */

    },{"./util/minimal":17,"./writer":18}]},{},[1]);