"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const util_2 = require("./util");
class JWT {
    static base64UrlDecode(data) {
        data = data.replace(/-/g, "+").replace(/_/g, "/");
        const paddedData = data.padEnd(data.length + ((4 - (data.length % 4)) % 4), "=");
        return Buffer.from(paddedData, "base64").toString();
    }
    static base64UrlEncode(data) {
        return Buffer.from(data)
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }
}
exports.JWT = JWT;
JWT.RSA = {
    get GenrateKeys() {
        try {
            let { privateKey, publicKey } = (0, crypto_1.generateKeyPairSync)("rsa", {
                modulusLength: 2048,
            });
            privateKey = privateKey
                .export({ type: "pkcs1", format: "pem" })
                .toString("hex");
            return { privateKey, publicKey };
        }
        catch (error) {
            console.error(error);
        }
    },
    Encrypt(data, key) {
        console.log(JWT.RSABasic.Encrypt);
        return (0, util_2.erroHandel)(JWT.RSABasic.Encrypt, data, key);
    },
    Decrypt(data, key) {
        return (0, util_2.erroHandel)(JWT.RSABasic.Decrypt, data, key);
    },
};
JWT.RSASync = {
    async GenrateKeys() {
        let generateKeyPairASync = (0, util_1.promisify)(crypto_1.generateKeyPair);
        return new Promise(async (resolve, reject) => {
            try {
                const { privateKey, publicKey } = await generateKeyPairASync("rsa", {
                    modulusLength: 2048,
                });
                const hexPrivateKey = privateKey
                    .export({ type: "pkcs1", format: "pem" })
                    .toString("hex");
                console.log({ hexPrivateKey });
                resolve({ privateKey: hexPrivateKey, publicKey });
            }
            catch (error) {
                reject(error);
            }
        });
    },
    async Encrypt(data, key) {
        return await (0, util_2.Sync)(JWT.RSA.Encrypt, data, key);
    },
    async Decrypt(data, key) {
        return await (0, util_2.Sync)(JWT.RSA.Decrypt, data, key);
    },
};
JWT.SHA256 = {
    Sign(payload, secret, options) {
        return (0, util_2.erroHandel)(JWT.SHA256Basic.Sign, payload, secret, options);
    },
    Decrypt(token, options) {
        return (0, util_2.erroHandel)(JWT.SHA256Basic.Decrypt, token, options);
    },
    Verify(token, secret, options) {
        return (0, util_2.erroHandel)(JWT.SHA256Basic.Verify, token, secret, options);
    },
};
JWT.SHA256Sync = {
    async Sign(payload, secret, options) {
        return await (0, util_2.Sync)(JWT.SHA256Basic.Sign, payload, secret, options);
    },
    async Decrypt(token, options) {
        return await (0, util_2.Sync)(JWT.SHA256Basic.Decrypt, token, options);
    },
    async Verify(token, secret, options) {
        return await (0, util_2.Sync)(JWT.SHA256Basic.Verify, token, secret, options);
    },
};
JWT.RSABasic = {
    get GenrateKeys() {
        try {
            let { privateKey, publicKey } = (0, crypto_1.generateKeyPairSync)("rsa", {
                modulusLength: 2048,
            });
            privateKey = privateKey
                .export({ type: "pkcs1", format: "pem" })
                .toString("hex");
            return { privateKey, publicKey };
        }
        catch (error) {
            console.error(error);
        }
    },
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
    },
    Decrypt(token, key) {
        return (0, crypto_1.privateDecrypt)({
            key,
            padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, Buffer.from(token, "hex")).toString("utf-8");
    },
};
JWT.SHA256Basic = {
    Sign(payload, secret, options) {
        let now = Math.floor(Date.now() / 1000);
        payload = { data: payload, encoding: options?.encoding || "hex" };
        if (options?.iat == true)
            payload["iat"] = now;
        if (options?.expiresIn && options.expiresIn > 0)
            payload.exp = now + options.expiresIn;
        if (options?.notBefore && options.notBefore > 0)
            payload.nbf = now + options.notBefore;
        if (options?.iss)
            payload.iss = options.iss;
        if (options?.sub)
            payload.sub = options.sub;
        if (options?.aud)
            payload.aud = options.aud;
        if (options?.jti)
            payload.jti = options.jti;
        const encodedHeader = JWT.base64UrlEncode((0, crypto_1.randomUUID)());
        const encodedPayload = JWT.base64UrlEncode(JSON.stringify(payload));
        const dataToSign = `${encodedHeader}.${encodedPayload}`;
        const signature = (0, crypto_1.createHmac)("sha256", secret)
            .update(dataToSign)
            .digest(payload.encoding);
        return `${encodedHeader}.${encodedPayload}.${signature}.${JWT.base64UrlEncode(payload.encoding)}`;
    },
    Decrypt(token, options) {
        const [, encodedPayload] = token.split(".");
        let decodedPayload = JWT.base64UrlDecode(encodedPayload);
        try {
            decodedPayload = JSON.parse(decodedPayload);
        }
        catch { }
        return options?.diractData ? decodedPayload["data"] : decodedPayload;
    },
    Verify(token, secret, options) {
        let [encodedHeader, encodedPayload, providedSignature, encoding] = token.split(".");
        encoding = JWT.base64UrlDecode(encoding);
        const validEncodings = [
            "base64",
            "base64url",
            "hex",
            "binary",
        ];
        if (!encodedHeader ||
            !encodedPayload ||
            !providedSignature ||
            !validEncodings.includes(encoding)) {
            return new Error("Invalid format");
        }
        const dataToSign = `${encodedHeader}.${encodedPayload}`;
        const computedSignature = (0, crypto_1.createHmac)("sha256", secret)
            .update(dataToSign)
            .digest(encoding);
        if (computedSignature !== providedSignature) {
            return new Error("Invalid token");
        }
        let decodedPayload = JWT.base64UrlDecode(encodedPayload);
        const now = Math.floor(Date.now() / 1000); // الوقت الحالي بالثواني
        if (decodedPayload.exp && now > decodedPayload.exp) {
            return new Error("Token expired");
        }
        if (decodedPayload.nbf && now < decodedPayload.nbf) {
            return new Error("Token not active yet");
        }
        try {
            decodedPayload = JSON.parse(decodedPayload);
        }
        catch { }
        return options?.diractData ? decodedPayload["data"] : decodedPayload;
    },
};
