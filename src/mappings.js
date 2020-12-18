const MAPPING_DATA_URL = "https://sparkmappings.lucko.me/";

export async function getMappingsInfo() {
    const mappings = await fetch(MAPPING_DATA_URL + "mappings.json");
    return await mappings.json();
}

export async function requestMappings(type, mappingsInfo) {
    if (type.startsWith("bukkit-mojang")) {
        const version = type.substring("bukkit-mojang-".length);
        const nmsVersion = mappingsInfo.types['bukkit-mojang'].versions[version].nmsVersion;

        const [mojangMappings, bukkitMappings] = await Promise.all([
            fetch(MAPPING_DATA_URL + version + "/mojang.json").then(r => r.json()),
            fetch(MAPPING_DATA_URL + version + "/bukkit.json").then(r => r.json())
        ]);

        bukkitGenReverseIndex(bukkitMappings);
        return bukkitMojangRemap(mojangMappings, bukkitMappings, nmsVersion)
    } else if (type.startsWith("bukkit")) {
        const version = type.substring("bukkit-".length);
        const nmsVersion = mappingsInfo.types.bukkit.versions[version].nmsVersion;

        const [mcpMappings, bukkitMappings] = await Promise.all([
            fetch(MAPPING_DATA_URL + version + "/mcp.json").then(r => r.json()),
            fetch(MAPPING_DATA_URL + version + "/bukkit.json").then(r => r.json())
        ]);

        bukkitGenReverseIndex(bukkitMappings);
        return bukkitMcpRemap(mcpMappings, bukkitMappings, nmsVersion)
    } else if (type.startsWith("mcp")) {
        const version = type.substring("mcp-".length);

        const mcpMappings = await fetch(MAPPING_DATA_URL + version + "/mcp.json").then(r => r.json());
        return mcpRemap(mcpMappings)
    } else if (type.startsWith("yarn")) {
        const version = type.substring("yarn-".length);

        const yarnMappings = await fetch(MAPPING_DATA_URL + version + "/yarn.json").then(r => r.json());
        return yarnRemap(yarnMappings)
    } else {
        return _ => {}
    }
}

// create reverse index for classes by obfuscated name
function bukkitGenReverseIndex(bukkitMappings) {
    const classesObfuscated = {};
    const classes = bukkitMappings.classes;
    for (const bukkitName in classes) {
        if (!classes.hasOwnProperty(bukkitName)) {
            continue;
        }
        const mapping = bukkitMappings.classes[bukkitName];
        classesObfuscated[mapping.obfuscated] = mapping;
    }
    bukkitMappings.classesObfuscated = classesObfuscated;
}

const bukkitMojangRemap = (mojangMappings, bukkitMappings, nmsVersion) => (node) => {
    if (!node.className.startsWith("net.minecraft.server." + nmsVersion + ".")) return {};
    const nmsClassName = node.className.substring(("net.minecraft.server." + nmsVersion + ".").length);

    let bukkitClassData = bukkitMappings.classes[nmsClassName];
    if (nmsClassName === "MinecraftServer") {
        bukkitClassData = bukkitMappings.classes["net.minecraft.server.MinecraftServer"];
    }
    if (!bukkitClassData) return {};

    const obfuscatedClassName = bukkitClassData.obfuscated;
    const mojangClassData = mojangMappings.classes[obfuscatedClassName];
    if (!mojangClassData) return {};

    // if bukkit has already provided a mapping for this method, just return.
    for (const method of bukkitClassData.methods) {
        if (method.bukkitName === node.methodName) {
            return {};
        }
    }

    let mojangMethods = [];
    for (const mojangMethod of mojangClassData.methods) {
        if (mojangMethod.obfuscated === node.methodName) {
            mojangMethods.push(mojangMethod);
        }
    }

    if (!mojangMethods) return {};

    if (mojangMethods.length === 1) {
        const methodName = mojangMethods[0].mojangName;
        return { methodName };
    }

    const methodDesc = node.methodDesc;
    if (!methodDesc) return {};

    for (const mojangMethod of mojangMethods) {
        const obfDesc = mojangMethod.description;

        // generate the deobfucscated description for the method (obf mojang --> bukkit)
        const deobfDesc = obfDesc.replace(/L([^;]+);/g, function(match) {
            // the obfuscated type name
            const obfType = match.substring(1, match.length - 1);

            // find the mapped bukkit class for the obf'd type.
            const bukkitMapping = bukkitMappings.classesObfuscated[obfType];
            if (bukkitMapping) {
                return "Lnet/minecraft/server/" + nmsVersion + "/" + bukkitMapping.mapped + ";";
            }

            return match;
        });

        // if the description of the method we're trying to remap matches the converted
        // description of the MCP method, we have a match...
        if (methodDesc === deobfDesc) {
            const methodName = mojangMethod.mojangName;
            return { methodName };
        }
    }

    return {};
}

const bukkitMcpRemap = (mcpMappings, bukkitMappings, nmsVersion) => (node) => {
    if (!node.className.startsWith("net.minecraft.server." + nmsVersion + ".")) return {};
    const nmsClassName = node.className.substring(("net.minecraft.server." + nmsVersion + ".").length);

    let bukkitClassData = bukkitMappings.classes[nmsClassName];
    if (nmsClassName === "MinecraftServer") {
        bukkitClassData = bukkitMappings.classes["net.minecraft.server.MinecraftServer"];
    }
    if (!bukkitClassData) return {};

    const obfuscatedClassName = bukkitClassData.obfuscated;
    const mcpClassData = mcpMappings.classes[obfuscatedClassName];
    if (!mcpClassData) return {};

    // if bukkit has already provided a mapping for this method, just return.
    for (const method of bukkitClassData.methods) {
        if (method.bukkitName === node.methodName) {
            return {};
        }
    }

    let mcpMethods = [];
    for (const mcpMethod of mcpClassData.methods) {
        if (mcpMethod.obfuscated === node.methodName) {
            mcpMethods.push(mcpMethod);
        }
    }

    if (!mcpMethods) return {};

    if (mcpMethods.length === 1) {
        const methodName = mcpMethods[0].mcpName;
        return { methodName };
    }

    const methodDesc = node.methodDesc;
    if (!methodDesc) return {};

    for (const mcpMethod of mcpMethods) {
        const obfDesc = mcpMethod.description;

        // generate the deobfucscated description for the method (obf mojang --> bukkit)
        const deobfDesc = obfDesc.replace(/L([^;]+);/g, function(match) {
            // the obfuscated type name
            const obfType = match.substring(1, match.length - 1);

            // find the mapped bukkit class for the obf'd type.
            const bukkitMapping = bukkitMappings.classesObfuscated[obfType];
            if (bukkitMapping) {
                return "Lnet/minecraft/server/" + nmsVersion + "/" + bukkitMapping.mapped + ";";
            }

            return match;
        });

        // if the description of the method we're trying to remap matches the converted
        // description of the MCP method, we have a match...
        if (methodDesc === deobfDesc) {
            const methodName = mcpMethod.mcpName;
            return { methodName };
        }
    }

    return {};
}

const mcpRemap = (mcpMappings) => (node) => {
    const methodName = mcpMappings.methods[node.methodName];
    return { methodName };
}

const yarnRemap = (yarnMappings) => (node) => {
    const className = yarnMappings.classes[node.className];
    const methodName = yarnMappings.methods[node.methodName];
    return { className, methodName };
}
