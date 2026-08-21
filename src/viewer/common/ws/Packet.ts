import { PacketWrapper } from '../../proto/spark_pb';
import { Listener } from './Listener';

export type Packet = PacketWrapper['packet'];
export type PacketListener = Listener<Packet>;

export function encodePacket(packet: Packet): Uint8Array {
    return PacketWrapper.toBinary({ packet });
}

export function decodePacket(buf: Uint8Array): Packet {
    return PacketWrapper.fromBinary(buf).packet;
}
