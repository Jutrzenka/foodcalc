import {TokenError} from "../utils/errors.js";
import { Token } from "../types/token.type.js";
import {pool} from "../utils/database/db.js";
import {nanoid} from "nanoid";
import {FieldPacket, RowDataPacket} from "mysql2/promise";

export class TokenRecord implements Token {
    userId: string; //36
    id: string; //nanoid(24)
    actuallyCode: string | null;
    constructor(obj: Token) {
        if (!obj.id || obj.id.length !== 24) {
            throw new TokenError();
        }
        if (!obj.userId || obj.userId.length !== 36) {
            throw new TokenError();
        }
        if (!obj.actuallyCode || obj.actuallyCode.length !== 36) {
            throw new TokenError();
        }
        this.id = obj.id;
        this.userId = obj.userId;
        this.actuallyCode = obj.actuallyCode;
    }
    async insert(): Promise<string> {
        await pool.execute("INSERT INTO `token`(`id`, `userId`, `actuallyCode`) VALUES(:id, :userId, :actuallyCode)", {
            id: this.id,
            userId: this.userId,
            actuallyCode: this.actuallyCode,
        });
        return this.id;
    }
    static async getOneToken(userId: string) {
        const [results] = (await pool.execute("SELECT * FROM `token` WHERE `userId` = :userId", {
            userId,
        }) as [TokenRecord[], FieldPacket[]]);
        return results.length === 0 ? null : new TokenRecord(results[0]);
    }
    static async updateActuallyCode(actuallyCode:string): Promise<string> {
        const newCode = nanoid(36);
        await pool.execute("UPDATE `token` SET `actuallyCode` = :newCode  WHERE `actuallyCode` = :actuallyCode",{
            actuallyCode,
            newCode
        });
        return newCode;
    }
    static async getIdToken(actuallyCode: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT `id` FROM `token` WHERE `actuallyCode` = :actuallyCode", {
            actuallyCode,
        }) as [RowDataPacket[], FieldPacket[]]);
        return results.length === 0 ? null : results[0].id;
    }
    static async getUserIdToken(actuallyCode: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT `userId` FROM `token` WHERE `actuallyCode` = :actuallyCode", {
            actuallyCode,
        }) as [RowDataPacket[], FieldPacket[]]);
        return results.length === 0 ? null : results[0].id;
    }
}