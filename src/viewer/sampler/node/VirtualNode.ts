import { NodeDetails } from '../../proto/nodes';

// represents the data of a node (frame)
// One instance per ConcreteClass::method, meaning LivingEntity::tick() can have multiple virtual nodes, one per living entity
export default interface VirtualNode {
    getId(): number | number[];

    getDetails(): NodeDetails;

    getTime(): number;

    getTimes(): number[];

    getChildren(): VirtualNode[];

    getParents(): VirtualNode[];

    getSource(): string | undefined;
}
