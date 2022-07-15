import {Router} from "express";
import {authMiddleware} from "../utils/middleware/authMiddleware.js";
import {ProductRecord} from "../records/product.record.js";
import {nanoid} from "nanoid";
import {RecipeRecord} from "../records/recipe.record.js";
import {Product_RecipeRecord} from "../records/product_recipe.record.js";

export const appRouter = Router();

appRouter
    .use(authMiddleware)
    .get("/recipes", async(req, res) => {
        const userId = res.locals.user.userId;
        res.render("clients/app/recipes", {
            recipes: (await RecipeRecord.listAll(userId)),
        })
    })

    .get("/products", async(req, res) => {
        const userId = res.locals.user.userId;
        res.render("clients/app/products", {
            products: (await ProductRecord.listAll(userId)),
        })
    })

    .get("/recipes/:id", async (req, res) => {
        const { id } = req.params;
        const userId = res.locals.user.userId;
        const recipe = await RecipeRecord.getOne(id, userId);
        const products = await ProductRecord.listAll(userId);
        const selectProducts = await Product_RecipeRecord.listAll(userId, id);
        res.render("clients/app/oneRecipe", {
            idRecipe: id,
            recipe,
            products,
            selectProducts,
        });
    })

    .put("/recipes", async(req, res) => {
        const userId = res.locals.user.userId;
        await new RecipeRecord({userId: userId, id: nanoid(24), name: "Nowy przepis"}).insert();
        res.render("alert", {
            title: "Udało się dodać nowy przepis!",
        })
    })

    .patch("/recipes/:id", async (req, res) => {
        const { id } = req.params;
        const {name, description} = req.body;
        const userId = res.locals.user.userId;
        await new RecipeRecord({userId, id, name, description}).update()
        res.render("alert", {
            title: "Udało się zaktualizować przepis",
            message: `Przepis ${name} został zaktualizowany!`,
        })
    })

    .delete("/recipes/:id", async (req, res) => {
        const { id } = req.params;
        const userId = res.locals.user.userId;
        await RecipeRecord.delete(id, userId);
        res.render("alert", {
            title: "Udało się usunąć produkt",
            message: `Produkt został usunięty!`,
        })
    })

    .get("/products/:id", async (req, res) => {
        const { id } = req.params;
        const userId = res.locals.user.userId;
        const product = await ProductRecord.getOne(id, userId);
        res.render("clients/app/oneProduct", {
            idProduct: id,
            product,
        });
    })

    .put("/products", async(req, res) => {
        const userId = res.locals.user.userId;
        await new ProductRecord({userId: userId, id: nanoid(24), name: "Nowy produkt"}).insert();
        res.render("alert", {
            title: "Udało się dodać nowy produkt!",
        })
    })

    .patch("/products/:id", async (req, res) => {
        const { id } = req.params;
        const {name, energy, fat, carbohydrates, protein} = req.body;
        const userId = res.locals.user.userId;
        await new ProductRecord({userId, id, name, energy, fat, carbohydrates, protein}).update()
        res.render("alert", {
            title: "Udało się zaktualizować produkt",
            message: `Produkt ${name} został zaktualizowany!`,
        })
    })

    .delete("/products/:id", async (req, res) => {
        const { id } = req.params;
        const userId = res.locals.user.userId;
        await ProductRecord.delete(id, userId);
        res.render("alert", {
            title: "Udało się usunąć produkt",
            message: `Produkt został usunięty!`,
        })
    })

    .put("/recipes/:id/products/", async(req, res) => {
        const userId = res.locals.user.userId;
        const recipeId = req.params.id
        const { productId, amount } = req.body;
        await new Product_RecipeRecord({id: nanoid(24), userId, productId, amount, recipeId}).insert();
        res.render("alert", {
            title: "Udało się dodać produkt do listy w przepisie",
        })
    })

    .delete("/recipes/products/:idSelectProduct", async (req, res) => {
        const { idSelectProduct } = req.params;
        const userId = res.locals.user.userId;
        await Product_RecipeRecord.delete(idSelectProduct, userId);
        res.render("alert", {
            title: "Udało się usunąć produkt",
            message: `Produkt został usunięty z listy w przepisie!`,
        })
    })

    .get("/", async(req, res) => {
        res.status(403).redirect("/app/recipes")
    })