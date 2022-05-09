import express, { response} from "express";
import cors from "cors";
import Joi from "joi";
import dayjs from "dayjs";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import db from "./db.js";
import { postSignIn, postSignUp } from "./controllers/authController.js";
import { getRegistros, postRegistros } from "./controllers/registrosController.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.post("/sign-up", postSignUp);

app.post("/sign-in", postSignIn);

app.post("/registros", postRegistros);

app.get("/registros", getRegistros);

app.listen(5000);
