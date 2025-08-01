import { NodeDetails } from '../../proto/nodes';

export default interface VirtualNode {
    getId(): number | number[];

    getDetails(): NodeDetails;

    getTime(): number;

    getTimes(): number[];

    getChildren(): VirtualNode[];

    getParents(): VirtualNode[];

    getSource(): string | undefined;

    setExpanded?(expanded: boolean): void;
}
