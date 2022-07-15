import { FieldPacket } from "mysql2/promise";
import { Product } from "../types/product.type.js";
import { pool } from "../utils/database/db.js";
import {ValidationError} from "../utils/errors.js";

export class ProductRecord implements Product {
    id: string; //nanoid(24)
    name: string;
    userId: string; //36
    energy?: number | null;
    fat?: number | null;
    protein?: number | null;
    carbohydrates?: number | null;

    constructor(obj: Product) {
        if (!obj.id || obj.id.length !== 24) {
            throw new Error('Poważny błąd produktu. Przepraszamy');
        }
        if (!obj.name || obj.name.length >= 64) {
            throw new ValidationError('Błędne dane produktu');
        }
        if (!obj.userId || obj.userId.length !== 36) {
            throw new ValidationError('Błędne dane produktu');
        }
        if (obj.energy) {
            if (obj.energy > 99999999 && obj.energy < 0) {
                throw new ValidationError('Błędne dane produktu');
            }
        }
        if (obj.fat) {
            if (obj.fat > 100 && obj.fat < 0) {
                throw new ValidationError('Błędne dane produktu');
            }
        }
        if (obj.protein) {
            if (obj.protein > 100 && obj.protein < 0) {
                throw new ValidationError('Błędne dane produktu');
            }
        }
        if (obj.carbohydrates) {
            if (obj.carbohydrates > 100 && obj.carbohydrates < 0) {
                throw new ValidationError('Błędne dane produktu');
            }
        }
        this.id = obj.id;
        this.name = obj.name;
        this.userId = obj.userId;
        this.energy = obj.energy ?? null;
        this.fat = obj.fat ?? null;
        this.protein = obj.protein ?? null;
        this.carbohydrates = obj.carbohydrates ?? null;
    }

    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `product`(`id`, `userId`, `name`) VALUES(:id, :userId, :name)", {
                id: this.id,
                userId: this.userId,
                name: this.name,
            });
            return this.id;
        } catch (err:any) {
            if (err.errno === 1062) {
                throw new ValidationError('Błędne dane produktu');
            }
            throw new Error();
        }
    }

    async update(): Promise<void> {
        await pool.execute("UPDATE `product` SET `name` = :name, `energy` = :energy, `fat` = :fat, `protein` = :protein, `carbohydrates` = :carbohydrates WHERE `id` = :id AND `userId` = :userId", {
            id: this.id,
            userId: this.userId,
            name: this.name ?? "Nowy produkt",
            energy: this.energy ?? null,
            fat: this.fat ?? null,
            protein: this.protein ?? null,
            carbohydrates: this.carbohydrates ?? null,
        });
    }

    static async delete(id: string, userId: string): Promise<void> {
        await pool.execute("DELETE FROM `product` WHERE `id` = :id AND `userId` = :userId", {
            id,
            userId,
        });
    }

    static async listAll(userId: string): Promise<ProductRecord[]> {
        const [results] = (await pool.execute("SELECT `id`, `userId`, `name` FROM `product` WHERE `userId` = :userId ORDER BY `name` ASC", {
            userId,
        }) as [ProductRecord[], FieldPacket[]]);
        return results.map(obj => new ProductRecord(obj));
    }

    static async getOne(id: string, userId: string): Promise<ProductRecord | null> {
        const [results] = (await pool.execute("SELECT `id`, `userId`, `name`, `energy`, `fat`, `protein`, `carbohydrates`  FROM `product` WHERE `id` = :id AND `userId` = :userId", {
            id,
            userId,
        }) as [ProductRecord[], FieldPacket[]]);
        return results.length === 0 ? null : new ProductRecord(results[0]);
    }
}