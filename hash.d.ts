import { JWT } from "./jwt";
export declare class Hash extends JWT {
    makePassword(password: string, key: string): string;
    matchPassword(hash: string, password: string, key: string): boolean;
    ID(): `${string}-${string}-${string}-${string}-${string}`;
    salt(): string;
}
