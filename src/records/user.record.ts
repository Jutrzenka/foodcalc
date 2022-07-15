import { FieldPacket } from "mysql2/promise";
import {Role, User} from "../types/user.type.js";
import { pool } from "../utils/database/db.js";
import {ValidationError, WrongUserError} from "../utils/errors.js";

export class UserRecord implements User {
    id: string;
    name: string;
    email: string;
    login: string;
    password: string;
    role: Role;
    constructor(obj: User) {
        if (!obj.id || obj.id.length !== 36) {
            throw new ValidationError('Błędny kod ID');
        }
        if (!obj.name || obj.name.length < 3 || obj.name.length > 26) {
            throw new ValidationError('Imię musi mieć od 3 do 25 znaków.');
        }
        if (!obj.email || !obj.email.includes("@") || obj.email.length < 5 || obj.email.length > 64) {
            throw new ValidationError('Błędny e-mail');
        }
        if (!obj.login || obj.login.length < 4 || obj.login.length > 30) {
            throw new ValidationError('Błędny login');
        }
        if (!obj.password || obj.password.length !== 60) {
            throw new ValidationError('Złe hasło');
        }
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.login = obj.login;
        this.password = obj.password;
        this.role = obj.role;
    }
    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `user`(`id`, `name`, `email`, `login`, `password`, `role`) VALUES(:id, :name, :email, :login, :password, :role)", {
                id: this.id,
                name: this.name,
                email: this.email,
                login: this.login,
                password: this.password,
                role: (this.role).toString(),
            });
            return this.id;
        } catch (err:any) {
            if (err.errno === 1062) {
                throw new WrongUserError();
            }
            throw new Error();
        }
    }
    static async getOne(login: string): Promise<UserRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `user` WHERE `login` = :login", {
            login,
        }) as [UserRecord[], FieldPacket[]]);
        return results.length === 0 ? null : new UserRecord(results[0]);
    }
}