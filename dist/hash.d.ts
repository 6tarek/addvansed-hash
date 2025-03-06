import { JWT } from "./jwt";
export declare class Hash extends JWT {
    static Password: {
        Hash(password: string, key: string): string | void;
        Match(hash: string, password: string, key: string): boolean | Error;
    };
    static PasswordSync: {
        Hash(password: string, key: string): Promise<string | void>;
        Match(hash: string, password: string, key: string): Promise<boolean | Error>;
    };
    private static PasswordBasic;
    ID({ short, }: Partial<{
        short?: {
            number?: {
                len?: number;
            };
            string?: {
                len?: number;
            };
        };
    }>): string;
    salt(): string;
}
