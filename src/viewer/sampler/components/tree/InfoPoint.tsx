import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InfoPointsHook, LookupResult } from '../../hooks/useInfoPoints';
import { MappingsResolver } from '../../mappings/resolver';
import VirtualNode from '../../node/VirtualNode';

export interface InfoPointProps {
    node: VirtualNode;
    mappings: MappingsResolver;
    lookup: InfoPointsHook;
}

export default function InfoPoint({ node, mappings, lookup }: InfoPointProps) {
    if (!lookup.enabled || !lookup.methods || !lookup.threads) {
        return null;
    }

    const details = node.getDetails();
    if (details.type === 'stackTrace') {
        const resolved = mappings.resolve(details);
        if (resolved.type === 'native') {
            return null;
        }

        const { className, methodName, packageName } = resolved;
        const desc = lookup.methods.lookup(
            `${packageName}${className}.${methodName}()`
        );
        return <Point desc={desc} />;
    } else if (details.type === 'thread') {
        const desc = lookup.threads.lookup(details.name);
        return <Point desc={desc} />;
    }
    return null;
}

const Point = ({ desc }: { desc: LookupResult }) => {
    if (desc.result) {
        return (
            <span
                className="infopoint"
                data-tooltip-id="infopoint-tooltip"
                data-tooltip-html={desc.result}
            >
                <FontAwesomeIcon icon={faInfoCircle} />
            </span>
        );
    }
    return null;
};
