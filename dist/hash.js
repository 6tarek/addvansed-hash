"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const crypto_1 = require("crypto");
const jwt_1 = require("./jwt");
const bcrypt_1 = require("bcrypt");
const util_1 = require("./util");
class Hash extends jwt_1.JWT {
    //hashing public & secrate key
    ID({ short, }) {
        let res = "";
        if (short) {
            if (short.number) {
                for (let i = 0; i < (short?.number?.len || 5); i++) {
                    res += (0, crypto_1.randomInt)(9);
                }
            }
            else {
                if (short?.string?.len || 5 < 20) {
                    res = (0, crypto_1.randomUUID)()
                        .split("-")
                        .join("")
                        .slice(0, short.string?.len || 5);
                }
            }
        }
        else
            res = (0, crypto_1.randomUUID)();
        return res;
    }
    salt() {
        return (0, crypto_1.randomBytes)(32).toString("hex");
    }
}
exports.Hash = Hash;
// password
Hash.Password = {
    Hash(password, key) {
        return (0, util_1.erroHandel)(Hash.PasswordBasic.Hash, password, key);
    },
    Match(hash, password, key) {
        return (0, util_1.erroHandel)(Hash.PasswordBasic.Match, hash, password, key);
    },
};
Hash.PasswordSync = {
    async Hash(password, key) {
        return (0, util_1.Sync)(Hash.PasswordBasic.Hash, password, key);
    },
    async Match(hash, password, key) {
        return (0, util_1.Sync)(Hash.PasswordBasic.Match, hash, password, key);
    },
};
Hash.PasswordBasic = {
    Hash(password, key) {
        return jwt_1.JWT.RSA.Encrypt((0, bcrypt_1.hashSync)(password, (0, bcrypt_1.genSaltSync)(12)), key);
    },
    Match(hash, password, key) {
        try {
            return (0, bcrypt_1.compareSync)(password, jwt_1.JWT.RSA.Decrypt(hash, key));
        }
        catch (error) {
            return false;
        }
    },
};
