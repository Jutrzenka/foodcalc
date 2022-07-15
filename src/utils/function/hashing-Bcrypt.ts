import {compare, hash} from "bcrypt"
import {ValidationError} from "../errors.js";

export const hashBCrypt = async (text: string): Promise<string | void> => {
    try {
        return await hash(text, 13);
    } catch(err) {
        throw new ValidationError(`Błędne dane`);
    }

}

export const verifyBCrypt = async (text: string, hash: string) => {
    try {
        return await compare(text, hash);
    } catch(err) {
        throw new ValidationError(`Błędne dane`);
    }

}