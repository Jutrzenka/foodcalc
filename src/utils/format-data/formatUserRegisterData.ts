import {Role, User} from "../../types/user.type.js";
import {nanoid} from "nanoid";
import {hashBCrypt} from "../function/hashing-Bcrypt.js";
import {ValidationError} from "../errors.js";

export const formatUserRegisterData = async (name: string, email: string, login: string, password: string): Promise<User> => {
    try {
        const hashPassword = await hashBCrypt(password);
    return {
        id: nanoid(36),
        name,
        email,
        login,
        password: hashPassword as string,
        role: Role.user,
    }
    } catch {
        throw new ValidationError('Błąd rejestracji');
    }
}