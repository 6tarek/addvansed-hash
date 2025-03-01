"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
const bun_1 = require("bun");
const crypto_1 = require("crypto");
class JWT {
    get GenrateKeys() {
        let { privateKey, publicKey } = (0, crypto_1.generateKeyPairSync)("rsa", {
            modulusLength: 2048,
        });
        privateKey = privateKey
            .export({ type: "pkcs1", format: "pem" })
            .toString("hex");
        return { privateKey, publicKey };
    }
    Encrypt(data, key) {
        try {
            return (0, crypto_1.publicEncrypt)({
                key,
                padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            }, Buffer.from(data, "utf-8")).toString("hex");
        }
        catch {
            return (0, crypto_1.privateEncrypt)({
                key,
                padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            }, Buffer.from(data, "utf-8")).toString("hex");
        }
    }
    Decrypt(token, key) {
        return (0, crypto_1.privateDecrypt)({
            key,
            padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, Buffer.from(token, "hex")).toString("utf-8");
    }
    sign(payload, secret, options) {
        payload = { payload, iat: Date.now(), ...options };
        const encodedHeader = this.base64UrlEncode((0, bun_1.randomUUIDv7)());
        const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
        const dataToSign = `${encodedHeader}.${encodedPayload}`;
        const signature = (0, crypto_1.createHmac)("sha256", secret)
            .update(dataToSign)
            .digest("base64url");
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
    JWTDecrypt(data, secret) {
        const [encodedHeader, encodedPayload, providedSignature] = data.split(".");
        if (!encodedHeader || !encodedPayload || !providedSignature) {
            throw new Error("Invalid token format");
        }
        const dataToSign = `${encodedHeader}.${encodedPayload}`;
        const computedSignature = (0, crypto_1.createHmac)("sha256", secret)
            .update(dataToSign)
            .digest("base64url");
        if (computedSignature !== providedSignature) {
            throw new Error("Invalid token");
        }
        let decodedPayload = this.base64UrlDecode(encodedPayload);
        try {
            decodedPayload = JSON.parse(decodedPayload);
        }
        catch { }
        if (decodedPayload.ext) {
            if (decodedPayload.iat + decodedPayload.ext <= Date.now())
                throw new Error("Expaired token");
        }
        return decodedPayload["payload"];
    }
    base64UrlDecode(data) {
        data = data.replace(/-/g, "+").replace(/_/g, "/");
        const paddedData = data.padEnd(data.length + ((4 - (data.length % 4)) % 4), "=");
        return Buffer.from(paddedData, "base64").toString();
    }
    base64UrlEncode(data) {
        return Buffer.from(data)
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }
}
exports.JWT = JWT;
