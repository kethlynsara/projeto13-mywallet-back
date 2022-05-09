import { Router } from "express";
import { getRegistros, postRegistros } from "../controllers/registrosController.js";

const registrosRouter = Router();

registrosRouter.post("/registros", postRegistros);

registrosRouter.get("/registros", getRegistros);

export default registrosRouter;