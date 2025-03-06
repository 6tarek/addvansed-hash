"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sync = Sync;
exports.erroHandel = erroHandel;
async function Sync(fun, ...par) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await fun(...par));
        }
        catch (error) {
            reject(error);
        }
    });
}
function erroHandel(fun, ...par) {
    try {
        return fun(...par);
    }
    catch (error) {
        new Error(String(error));
    }
}
