export declare class JWT {
    get GenrateKeys(): {
        privateKey: any;
        publicKey: any;
    };
    Encrypt(data: any, key: any): string;
    Decrypt(token: any, key: string): string;
    sign(payload: any, secret: string, options?: any): string;
    JWTDecrypt(data: string, secret: string): any;
    private base64UrlDecode;
    private base64UrlEncode;
}
