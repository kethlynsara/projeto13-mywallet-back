import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import registrosRouter from "./routes/registrosRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use(authRouter);
app.use(registrosRouter);

app.listen(5000, () => {
    console.log(`Server is up and running on port 5000`);
});
