import {
    decode as base64Decode,
    encode as base64Encode,
} from 'base64-arraybuffer';
import { get as lsGet, set as lsSet } from 'local-storage';

type KeyFormats = Extract<KeyFormat, 'spki' | 'pkcs8'>;

export interface Keys {
    publicKey: CryptoKey;
    privateKey: CryptoKey;
}

export async function loadKeys(): Promise<Keys | undefined> {
    const encodedPublicKey = lsGet<string>('viewer-public-key');
    const encodedPrivateKey = lsGet<string>('viewer-private-key');

    if (encodedPublicKey && encodedPrivateKey) {
        const publicKey = await importPublicKey(
            base64Decode(encodedPublicKey),
            []
        );
        const privateKey = await importPrivateKey(
            base64Decode(encodedPrivateKey),
            ['sign']
        );
        return { publicKey, privateKey };
    }
}

export async function generateKeys(): Promise<Keys> {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
        {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
        },
        true,
        ['sign']
    );

    const exportedPublicKey = await crypto.subtle.exportKey('spki', publicKey);
    lsSet('viewer-public-key', base64Encode(exportedPublicKey));

    const exportedPrivateKey = await crypto.subtle.exportKey(
        'pkcs8',
        privateKey
    );
    lsSet('viewer-private-key', base64Encode(exportedPrivateKey));

    return { publicKey, privateKey };
}

export function importPublicKey(
    raw: BufferSource,
    usages: KeyUsage[]
): Promise<CryptoKey> {
    return importKey('spki', raw, usages);
}

export function importPrivateKey(
    raw: BufferSource,
    usages: KeyUsage[]
): Promise<CryptoKey> {
    return importKey('pkcs8', raw, usages);
}

export function importKey(
    format: KeyFormats,
    raw: BufferSource,
    keyUsages: KeyUsage[]
): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        format,
        raw,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        true,
        keyUsages
    );
}
