import { Router } from "express";
import { getRegistros, postRegistros } from "../controllers/registrosController.js";
import tokenValidation  from "../middlewares/tokenValidationMiddleware.js";


const registrosRouter = Router();

registrosRouter.post("/registros", tokenValidation, postRegistros);

registrosRouter.get("/registros", tokenValidation, getRegistros);

export default registrosRouter;