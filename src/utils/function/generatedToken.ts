import jwt from "jsonwebtoken";
import {Response} from "express";

export interface Payload {
    name: string;
    userId: string;
    login: string;
}

export const generatedToken = (res: Response, secretId: string, actuallyCode: string, payload: Payload): Response => {
    const token = jwt.sign({name: payload.name, userId: payload.userId, login: payload.login}, secretId, {
        expiresIn: "15m",
    });
    res.cookie('x-mega-food-token', token, {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
    });
    res.cookie('x-mega-food-actuallyCode', actuallyCode, {
        httpOnly: true,
    });
    return res;
}