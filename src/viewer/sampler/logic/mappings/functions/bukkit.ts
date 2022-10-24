import {
    BukkitMappings,
    ClassMapping,
    McpMappings,
    MojangMappings,
    StackTraceNode,
} from '../../../../proto/spark_pb';
import { MappingFunction, RawMappingsResult } from '../types';

export default class BukkitMappingFunction implements MappingFunction {
    private readonly expectedPackage: string;
    private readonly classesObfuscated: Record<string, ClassMapping>;

    constructor(
        private readonly outputMappings: MojangMappings | McpMappings,
        private readonly bukkitMappings: BukkitMappings,
        private readonly nmsVersion?: string
    ) {
        if (nmsVersion) {
            this.expectedPackage = 'net.minecraft.server.' + nmsVersion + '.';
        } else {
            this.expectedPackage = 'net.minecraft.';
        }

        this.classesObfuscated = {};
        for (const mapping of Object.values(bukkitMappings.classes)) {
            this.classesObfuscated[mapping.obfuscated] = mapping;
        }
    }

    map(node: StackTraceNode): RawMappingsResult {
        // ignore non-NMS packages
        if (!node.className.startsWith(this.expectedPackage)) {
            return {};
        }

        const nmsClassName = node.className.substring(
            this.expectedPackage.length
        );
        let bukkitClassData;

        if (this.nmsVersion) {
            bukkitClassData = this.bukkitMappings.classes[nmsClassName];
        } else {
            bukkitClassData =
                this.bukkitMappings.classes['net.minecraft.' + nmsClassName];
        }

        if (nmsClassName === 'MinecraftServer') {
            bukkitClassData =
                this.bukkitMappings.classes[
                    'net.minecraft.server.MinecraftServer'
                ];
        }

        if (!bukkitClassData) {
            return {};
        }

        const obfuscatedClassName = bukkitClassData.obfuscated;
        const outputClassData =
            this.outputMappings.classes[obfuscatedClassName];
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
            const deobfDesc = obfDesc.replace(/L([^;]+);/g, match => {
                // the obfuscated type name
                const obfType = match.substring(1, match.length - 1);

                // find the mapped bukkit class for the obf'd type.
                const bukkitMapping = this.classesObfuscated[obfType];
                if (bukkitMapping) {
                    if (this.nmsVersion) {
                        return (
                            'Lnet/minecraft/server/' +
                            this.nmsVersion +
                            '/' +
                            bukkitMapping.mapped +
                            ';'
                        );
                    } else {
                        return (
                            'L' +
                            bukkitMapping.mapped.replaceAll('.', '/') +
                            ';'
                        );
                    }
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
    }
}
