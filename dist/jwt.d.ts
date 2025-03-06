import { BinaryToTextEncoding } from "crypto";
export declare class JWT {
    static RSA: {
        readonly GenrateKeys: {
            privateKey: string;
            publicKey: any;
        } | void;
        Encrypt(data: string, key: any): string | void;
        Decrypt(data: string, key: any): string | void;
    };
    static RSASync: {
        GenrateKeys(): Promise<{
            privateKey: string;
            publicKey: any;
        } | void>;
        Encrypt(data: any, key: any): Promise<string>;
        Decrypt(data: any, key: any): Promise<string>;
    };
    static SHA256: {
        Sign(payload: any, secret: string, options?: Sha256SignOptions): string | Error;
        Decrypt(token: string, options?: Sha256DecryptOptions): any | Error;
        Verify(token: string, secret: string, options: Sha256DecryptOptions): any | Error;
    };
    static SHA256Sync: {
        Sign(payload: any, secret: string, options?: any): Promise<String | Error>;
        Decrypt(token: any, options?: Sha256DecryptOptions): Promise<any | Error>;
        Verify(token: any, secret: string, options: Sha256DecryptOptions): Promise<any | Error>;
    };
    private static RSABasic;
    private static SHA256Basic;
    private static base64UrlDecode;
    private static base64UrlEncode;
}
interface Sha256SignOptions {
    encoding?: BinaryToTextEncoding;
    expiresIn?: number;
    iat?: boolean;
    notBefore?: number;
    iss?: string;
    sub?: string;
    aud?: string;
    jti?: string;
}
interface Sha256DecryptOptions {
    diractData?: boolean;
}
export interface Keys {
    privateKey: string;
    publicKey: any;
}
export {};
