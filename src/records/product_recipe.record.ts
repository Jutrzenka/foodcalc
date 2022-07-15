import { FieldPacket } from "mysql2/promise";
import { Product_Recipe } from "../types/product_recipe.types.js";
import { pool } from "../utils/database/db.js";
import { ValidationError } from "../utils/errors.js";

export class Product_RecipeRecord implements Product_Recipe {
    id: string; //nanoid(24)
    userId: string; //36
    recipeId: string; //24
    productId: string; //24
    amount: number; //int(5)

    constructor(obj: Product_Recipe) {
        if (!obj.id || obj.id.length !== 24) {
            throw new Error('Poważny błąd produktu. Przepraszamy');
        }
        if (!obj.userId || obj.userId.length !== 36) {
            throw new ValidationError('Błędne dane produktu');
        }
        if (!obj.recipeId || obj.recipeId.length !== 24) {
            throw new ValidationError('Błędne dane produktu');
        }
        if (!obj.productId || obj.productId.length !== 24) {
            throw new ValidationError('Błędne dane produktu');
        }
        if (!obj.productId || (obj.amount > 99999 && obj.amount < 0)) {
            throw new ValidationError('Błędne dane produktu');
        }
        this.id = obj.id;
        this.userId = obj.userId;
        this.recipeId = obj.recipeId;
        this.productId = obj.productId;
        this.amount = obj.amount;
    }

    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `product_recipe`(`id`, `userId`, `recipeId`, `productId`, `amount`) VALUES(:id, :userId, :recipeId, :productId, :amount)", {
                id: this.id,
                userId: this.userId,
                recipeId: this.recipeId,
                productId: this.productId,
                amount: this.amount,
            });
            return this.id;
        } catch (err:any) {
            if (err.errno === 1062) {
                throw new ValidationError('Błędne dane produktu');
            }
            throw new Error();
        }
    }

    static async delete(id: string, userId: string): Promise<void> {
        await pool.execute("DELETE FROM `product_recipe` WHERE `id` = :id AND `userId` = :userId", {
            id,
            userId,
        });
    }

    static async listAll(userId: string, recipeId: string) {
        const [results] = (await pool.execute("SELECT `product_recipe`.`id`, `name`, `amount`, `energy`, `carbohydrates`, `fat`, `protein` FROM `product_recipe` JOIN `product` ON `product_recipe`.`productId` = `product`.`id` WHERE `product_recipe`.`recipeId` = :recipeId AND `product_recipe`.`userId` = :userId", {
            userId,
            recipeId,
        }) as [Product_RecipeRecord[], FieldPacket[]]);
        return results.map(obj => obj);
    }
}