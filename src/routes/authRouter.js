import { Router } from "express";
import { postSignIn, postSignUp } from "../controllers/authController.js";
import { validateSignUpData } from "../middlewares/signUpMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", validateSignUpData, postSignUp);

authRouter.post("/sign-in", postSignIn);

export default authRouter;