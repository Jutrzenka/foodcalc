import express from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import 'express-async-errors';
import methodOverride from "method-override";
import {engine as hbsEngine} from "express-handlebars";
import {handleCriticalError, handleTokenError, handleValidationError} from "./utils/errors.js";
import {authRouter} from "./routers/auth.route.js";
import {appRouter} from "./routers/app.route.js";
import {hallwayRouter} from "./routers/hallway.route.js";

const app = express();
// middleware
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true, }));
app.use(express.static("public"));
app.engine('.hbs', hbsEngine({ extname: '.hbs',}));
app.set('view engine', '.hbs');

// routing
app.use("/auth", authRouter);
app.use("/app", appRouter);
app.use("/hallway", hallwayRouter)

// redirect to home site
app.get("/*", async(req, res) => {
    res.redirect(303, "/hallway/login");
})

// handle errors
app.use(handleTokenError);
app.use(handleValidationError);
app.use(handleCriticalError);

// server listen
app.listen(process.env.PORT, () => {
    console.log(`Server listen... http://localhost:3000`)
})