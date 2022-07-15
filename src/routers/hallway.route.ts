import {Router} from "express";

export const hallwayRouter = Router();

hallwayRouter
    .get("/login", async(req, res) => {
        res.render("clients/hallway/hallwayLogin");
    })

    .get("/register", async(req, res) => {
        res.render("clients/hallway/hallwayRegister");
    })