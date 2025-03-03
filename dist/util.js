"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sync = Sync;
exports.erroHandel = erroHandel;
async function Sync(fun) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await fun());
        }
        catch (error) {
            reject(error);
        }
    });
}
function erroHandel(fun) {
    try {
        return fun();
    }
    catch (error) {
        return new Error(String(error));
    }
}
