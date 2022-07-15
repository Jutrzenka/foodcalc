export enum Role {
    user = "U",
    moderator = "A",
}

export interface User {
    id: string; //nanoid(36)
    name: string;
    email: string;
    login: string;
    password: string; //hash(60)
    role: Role; //enum Role(1)
}

export interface UserRefToken {
    userId: string; //nanoid(36)
    valueRefToken: string; //nanoid(24)
    actualRefToken: string; //jwt
}