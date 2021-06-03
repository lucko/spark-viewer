import React from 'react';

import Pbf from 'pbf';
import {
    BukkitMappings,
    McpMappings,
    MojangMappings,
    YarnMappings,
} from '../proto';

/*
 * Mappings Download
 *
 * The code in this section is responsible for downloading
 * mappings data from sparkmappings.lucko.me and converting
 * it into a format that the application can use.
 */

const MAPPING_DATA_URL = 'https://sparkmappings.lucko.me/dist/';

// Get the mappings info resource - returns a JSON object
// containing info about available mappings+versions, as well as
// information about how mappings can be applied automatically.
export async function getMappingsInfo() {
    const resp = await fetch(MAPPING_DATA_URL + 'mappings.json');
    return await resp.json();
}

// Attempts to determine which mappings to apply automatically,
// based on the mappings info resource and the current profile data.
function detectMappings(mappingsInfo, profileData) {
    if (!mappingsInfo.auto || !profileData.metadata) {
        return null;
    }

    const meta = profileData.metadata;
    if (
        meta &&
        meta.platform &&
        meta.platform.name &&
        meta.platform.minecraftVersion
    ) {
        const id =
            meta.platform.name.toLowerCase() +
            '/' +
            meta.platform.minecraftVersion;
        return mappingsInfo.auto[id];
    }
    return null;
}

// fetches mappings data of a given type, for a given version, then applies the parseFunc
// to convert the arraybuffer to a JS object
async function fetchMappings(version, type, schema) {
    const resp = await fetch(
        MAPPING_DATA_URL + version + '/' + type + '.pbmapping'
    );
    const buf = await resp.arrayBuffer();
    return schema.read(new Pbf(new Uint8Array(buf)));
}

// requests a mappings function '(node) => { ..mappings }' of the given type.
export async function requestMappings(type, mappingsInfo, profileData) {
    if (type === 'auto') {
        type = detectMappings(mappingsInfo, profileData);
        if (!type) {
            return _ => {};
        }
    }

    if (type.startsWith('bukkit-mojang')) {
        const version = type.substring('bukkit-mojang-'.length);
        const nmsVersion =
            mappingsInfo.types['bukkit-mojang'].versions[version].nmsVersion;

        const [mojangMappings, bukkitMappings] = await Promise.all([
            fetchMappings(version, 'mojang', MojangMappings),
            fetchMappings(version, 'bukkit', BukkitMappings),
        ]);

        return bukkitRemap(mojangMappings, bukkitMappings, nmsVersion);
    } else if (type.startsWith('bukkit')) {
        const version = type.substring('bukkit-'.length);
        const nmsVersion =
            mappingsInfo.types.bukkit.versions[version].nmsVersion;

        const [mcpMappings, bukkitMappings] = await Promise.all([
            fetchMappings(version, 'mcp', McpMappings),
            fetchMappings(version, 'bukkit', BukkitMappings),
        ]);

        return bukkitRemap(mcpMappings, bukkitMappings, nmsVersion);
    } else if (type.startsWith('mcp')) {
        const version = type.substring('mcp-'.length);

        const mcpMappings = await fetchMappings(version, 'mcp', McpMappings);
        return mcpRemap(mcpMappings);
    } else if (type.startsWith('yarn')) {
        const version = type.substring('yarn-'.length);

        const yarnMappings = await fetchMappings(version, 'yarn', YarnMappings);
        return yarnRemap(yarnMappings);
    } else {
        return _ => {};
    }
}

/*
 * Mapping functions
 *
 * The code in this section is responsible for using the mappings
 * data to remap class+method names to deobfuscated strings.
 *
 * The resultant functions accept a single parameter, a 'node' object
 * and return an object with remapped names, using the same parameters.
 * If mappings cannot be applied, an empty object is returned instead.
 */

const bukkitRemap = (outputMappings, bukkitMappings, nmsVersion) => {
    const expectedPackage = 'net.minecraft.server.' + nmsVersion + '.';

    // gen a reverse index
    bukkitMappings.classesObfuscated = {};
    for (const mapping of Object.values(bukkitMappings.classes)) {
        bukkitMappings.classesObfuscated[mapping.obfuscated] = mapping;
    }

    return node => {
        // ignore non-NMS packages
        if (!node.className.startsWith(expectedPackage)) {
            return {};
        }

        const nmsClassName = node.className.substring(expectedPackage.length);
        let bukkitClassData = bukkitMappings.classes[nmsClassName];
        if (nmsClassName === 'MinecraftServer') {
            bukkitClassData =
                bukkitMappings.classes['net.minecraft.server.MinecraftServer'];
        }

        if (!bukkitClassData) {
            return {};
        }

        const obfuscatedClassName = bukkitClassData.obfuscated;
        const outputClassData = outputMappings.classes[obfuscatedClassName];
        if (!outputClassData) {
            return {};
        }

        // if bukkit has already provided a mapping for this method, just return.
        if (bukkitClassData.methods.some(m => m.mapped === node.methodName)) {
            return {};
        }

        // find methods using the output mappings data that match
        let outputMethods = outputClassData.methods.filter(
            m => m.obfuscated === node.methodName
        );
        if (!outputMethods) {
            return {};
        }

        // got lucky - only one match, so just return that
        if (outputMethods.length === 1) {
            return { methodName: outputMethods[0].mapped };
        }

        // methods with a different description can use the same name
        // we need to find the right one!
        if (!node.methodDesc) return {};

        for (const outputMethod of outputMethods) {
            const obfDesc = outputMethod.description;

            // generate the deobfucscated description for the method (obf mojang --> bukkit)
            const deobfDesc = obfDesc.replace(/L([^;]+);/g, function (match) {
                // the obfuscated type name
                const obfType = match.substring(1, match.length - 1);

                // find the mapped bukkit class for the obf'd type.
                const bukkitMapping = bukkitMappings.classesObfuscated[obfType];
                if (bukkitMapping) {
                    return (
                        'Lnet/minecraft/server/' +
                        nmsVersion +
                        '/' +
                        bukkitMapping.mapped +
                        ';'
                    );
                }

                return match;
            });

            // if the description of the method we're trying to remap matches the converted
            // description of the MCP/Mojmap method, we have a match...
            if (node.methodDesc === deobfDesc) {
                const methodName = outputMethod.mapped;
                return { methodName };
            }
        }

        return {};
    };
};

const mcpRemap = mcpMappings => node => {
    const methodName = mcpMappings.methods[node.methodName];
    return { methodName };
};

const yarnRemap = yarnMappings => node => {
    const className = yarnMappings.classes[node.className];
    const methodName = yarnMappings.methods[node.methodName];
    return { className, methodName };
};

/*
 * Mapping function application and interpretation
 *
 * We now have raw mappings data, functions that can use this data
 * to deobfuscate a given node, so the only remaining thing is actually
 * applying the function and interpreting its output.
 */

// Takes a node and a mappings function, applies the function to the node,
// and interprets/manipulates the mappings function output so it can be displayed
// in the viewer.
//
// returns:
// {
//   thread:         boolean   if the node is a thread
//   native:         boolean   if the node is a native frame
//
//   /* the following may be missing if either of the above are true */
//   className:      string    the possibly remapped name of the class
//   methodName:     string    the possibly remapped name of the method
//   packageName:    string    the name of the package
//   lambda:         string    the lambda description component of the stack, if any (comes after the clasName)
//   remappedClass:  boolean   if the className was remapped
//   remappedMethod: boolean   if the methodName was remapped
// }
//
export function resolveMappings(node, mappings) {
    // if the node does not have className or methodName fields, then it is a thread node.
    if (!node.className || !node.methodName) {
        return { thread: true };
    }

    // the the node's className is native, it is a native stack frame
    // so can be rendered accordingly.
    if (node.className === 'native') {
        return { native: true };
    }

    let { className, methodName } = mappings.func(node) || {};

    const remappedClass = !!className;
    const remappedMethod = !!methodName;

    className = className || node.className;
    methodName = methodName || node.methodName;

    let packageName;
    let lambda;

    // separate out package name
    let i = className.lastIndexOf('.');
    if (i !== -1) {
        packageName = className.substring(0, i + 1);
        className = className.substring(i + 1);
    }

    // separate out lambda description
    i = className.indexOf('$$Lambda');
    if (i !== -1) {
        lambda = className.substring(i);
        className = className.substring(0, i);
    }

    return {
        className,
        methodName,
        packageName,
        lambda,
        remappedClass,
        remappedMethod,
    };
}

export default function MappingsMenu({ mappingsInfo, mappings, setMappings }) {
    let groups = [
        {
            id: 'none',
            label: 'None',
            options: [
                { id: 'auto', label: 'Auto Detect' },
                { id: 'none', label: 'No Mappings' },
            ],
        },
    ];

    for (const type of Object.keys(mappingsInfo.types)) {
        const data = mappingsInfo.types[type];
        let versions = [];
        for (const id of Object.keys(data.versions)) {
            const version = data.versions[id];
            const label = data.format.replace('%s', version.name);
            versions.push({ id: type + '-' + id, label });
        }
        groups.push({ id: type, label: data.name, options: versions });
    }

    return (
        <span className="dropdown" id="mappings-selector">
            <select
                title="mappings"
                value={mappings}
                onChange={e => setMappings(e.target.value)}
            >
                {groups.map(group => (
                    <MappingsGroup group={group} key={group.id} />
                ))}
            </select>
        </span>
    );
}

const MappingsGroup = ({ group }) => {
    return (
        <optgroup label={group.label}>
            {group.options.map(opt => (
                <MappingsOption option={opt} key={opt.id} />
            ))}
        </optgroup>
    );
};

const MappingsOption = ({ option }) => {
    return <option value={option.id}>{option.label}</option>;
};
