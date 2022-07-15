import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {}
export class WrongUserError extends Error {}
export class TokenError extends Error {}

export const handleValidationError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof WrongUserError) {
        res
            .status(422)
            .render("error", {
                message: "Użytkownik z identycznym e-mailem, lub loginem już istnieje",
            });
        return;
    }
    if (err instanceof ValidationError) {
        res
            .status(400)
            .render("error", {
                message: err.message,
            });
        return;
    }
    next(err);
};

export const handleTokenError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof TokenError) {
        res
            .status(401)
            .render("error", {
                message: "Błędny token",
            });
        return;
    }
    next(err);
};

export const handleCriticalError = (err: Error, req: Request, res: Response) => {
    console.error(err);
    res
        .status(500)
        .render("error", {
            message: 'Przepraszamy, spróbuj ponownie za kilka minut.',
        });
    return;
}