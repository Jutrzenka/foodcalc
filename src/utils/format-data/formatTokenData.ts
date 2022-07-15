import {TokenError} from "../errors.js";
import { Token } from "../../types/token.type.js";
import {nanoid} from "nanoid";

export const formatTokenData = async (userId:string): Promise<Token> => {
    try {
        return {
            id: nanoid(24),
            userId,
            actuallyCode: nanoid(36),
        }
    } catch {
        throw new TokenError();
    }
}