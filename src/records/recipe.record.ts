import { FieldPacket } from "mysql2/promise";
import { Recipe } from "../types/recipe.type.js";
import { pool } from "../utils/database/db.js";
import { ValidationError } from "../utils/errors.js";


export class RecipeRecord implements Recipe {
    id: string; //nanoid(24)
    name: string;
    userId: string; //36
    description? : string | null;

    constructor(obj: Recipe) {
        if (!obj.id || obj.id.length !== 24) {
            throw new Error('Poważny błąd serwera przy tworzeniu przepisu. Przepraszamy');
        }
        if (!obj.name || obj.name.length >= 64) {
            throw new ValidationError('Błędna nazwa przepisu');
        }
        if (!obj.userId || obj.userId.length !== 36) {
            throw new ValidationError('Błędne dane przepisu');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.userId = obj.userId;
        this.description = obj.description ?? null;
    }

    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `recipe`(`id`, `userId`, `name`) VALUES(:id, :userId, :name)", {
                id: this.id,
                userId: this.userId,
                name: this.name,
            });
            return this.id;
        } catch (err:any) {
            if (err.errno === 1062) {
                throw new ValidationError('Błędne dane przepisu');
            }
            throw new Error();
        }
    }

    async update(): Promise<void> {
        await pool.execute("UPDATE `recipe` SET `name` = :name, `description` = :description WHERE `id` = :id AND `userId` = :userId", {
            id: this.id,
            userId: this.userId,
            name: this.name ?? "Nowy przepis",
            description: this.description ?? null,
        });
    }

    static async delete(id: string, userId: string): Promise<void> {
        await pool.execute("DELETE FROM `recipe` WHERE `id` = :id AND `userId` = :userId", {
            id,
            userId,
        });
    }

    static async listAll(userId: string): Promise<RecipeRecord[]> {
        const [results] = (await pool.execute("SELECT `id`, `userId`, `name` FROM `recipe` WHERE `userId` = :userId ORDER BY `name` ASC", {
            userId,
        }) as [RecipeRecord[], FieldPacket[]]);
        return results.map(obj => new RecipeRecord(obj));
    }

    static async getOne(id: string, userId: string): Promise<RecipeRecord | null> {
        const [results] = (await pool.execute("SELECT `id`, `userId`, `name`, `description`  FROM `recipe` WHERE `id` = :id AND `userId` = :userId", {
            id,
            userId,
        }) as [RecipeRecord[], FieldPacket[]]);
        return results.length === 0 ? null : new RecipeRecord(results[0]);
    }
}