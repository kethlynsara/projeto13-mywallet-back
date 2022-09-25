import { Router } from "express";
import authRouter from "./authRouter.js";
import registrosRouter from "./registrosRouter.js";

const router = Router();

router.use(authRouter);
router.use(registrosRouter);

export default router;