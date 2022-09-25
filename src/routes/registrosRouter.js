import { Router } from "express";
import { getRegistros, postRegistros } from "../controllers/registrosController.js";
import { validateRegistrosData } from "../middlewares/registrosMiddleware.js";
import tokenValidation  from "../middlewares/tokenValidationMiddleware.js";

const registrosRouter = Router();

registrosRouter.use(tokenValidation);

registrosRouter.get("/registros", getRegistros);
registrosRouter.post("/registros", validateRegistrosData, postRegistros);

export default registrosRouter;