import {NextFunction, Request, Response} from "express";
import {TokenRecord} from "../../records/token.record.js";
import jwt, {VerifyErrors} from "jsonwebtoken";
import {generatedToken} from "../function/generatedToken.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['x-mega-food-token'] ?? 1;
    const actuallyCode = req.cookies['x-mega-food-actuallyCode'] ?? 1;
    const idToken = await TokenRecord.getIdToken(actuallyCode);
    if (typeof idToken !== "string") {
        res.status(401).redirect("/auth/break-session");
        return;
    }
    jwt.verify(token, idToken as string,
        async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            res.status(403).redirect("/auth/break-session");
            return;
        }
        generatedToken(res, idToken, (await TokenRecord.updateActuallyCode(actuallyCode)),
            {name:decoded.name, userId:decoded.userId, login: decoded.login})
            res.locals.user = {name:decoded.name, userId:decoded.userId, login: decoded.login};
        next();
    })
}