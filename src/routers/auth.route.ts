import {Router} from "express";
import { TokenRecord } from "../records/token.record.js";
import { UserRecord } from "../records/user.record.js";
import { formatTokenData } from "../utils/format-data/formatTokenData.js";
import { formatUserRegisterData } from "../utils/format-data/formatUserRegisterData.js";
import {verifyBCrypt} from "../utils/function/hashing-Bcrypt.js";
import {generatedToken} from "../utils/function/generatedToken.js";

export const authRouter = Router();

authRouter
    .post("/register", async(req, res) => {
        const {name, login, password, email } = req.body;
        const user = new UserRecord(await formatUserRegisterData(name, email, login, password));
        const userToken = new TokenRecord(await formatTokenData(user.id))
        await user.insert();
        await userToken.insert();
        res.render("success", {
            title: "Rejestracja powiodła się!",
            message: "Teraz możesz się zalogować"
        });
    })

    .post("/login", async(req, res) => {
        const user = await UserRecord.getOne(req.body.login ?? "1");
        if (user !== null && await verifyBCrypt(req.body.password, user.password)) {
            const token = await TokenRecord.getOneToken(user.id);
            if (token !== null) {
                const actuallyCode = await TokenRecord.updateActuallyCode(token.actuallyCode as string);
                generatedToken(res, token.id, actuallyCode as string, {login: user.login, name: user.name, userId: user.id})
            }
            res.redirect("/app");
        } else {
            res.status(400).render("failed", {
                title: "Logowanie nie powiodło się!",
                message: "Podano błędne dane logowania!",
            });
        }
    })

    .get("/logout", async(req, res) => {
        const actuallyCode = req.cookies['x-mega-food-actuallyCode'] ?? 1;
        await TokenRecord.updateActuallyCode(actuallyCode);
        res.cookie('x-mega-food-token', "", {
            maxAge: 5,
            httpOnly: true,
        });
        res.cookie('x-mega-food-actuallyCode', "", {
            maxAge: 5,
            httpOnly: true,
        });
        res.redirect("/");
    })

    .get("/break-session", async (req, res) => {
        res.render("failed", {
            title: "Twoja sesja wygasła zaloguj się ponownie!",
            message: "Aby dalej przegladać stronę zaloguj się ponownie",
        })
    })