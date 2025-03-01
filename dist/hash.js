"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const crypto_1 = require("crypto");
const jwt_1 = require("./jwt");
const bcrypt_1 = require("bcrypt");
class Hash extends jwt_1.JWT {
    // password
    makePassword(password, key) {
        return this.Encrypt((0, bcrypt_1.hashSync)(password, (0, bcrypt_1.genSaltSync)(12)), key);
    }
    matchPassword(hash, password, key) {
        return (0, bcrypt_1.compareSync)(password, this.Decrypt(hash, key));
    }
    //hashing public & secrate key
    ID() {
        return (0, crypto_1.randomUUID)();
    }
    salt() {
        return (0, crypto_1.randomBytes)(32).toString("hex");
    }
}
exports.Hash = Hash;
