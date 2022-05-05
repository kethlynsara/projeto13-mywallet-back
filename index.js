import { MongoClient, ObjectId } from "mongodb";
import express from "express";
//import cors from "cors";
import Joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

const app = express();

//app.use(cors());
app.use(express.json());

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
let db= null;
const promise = mongoClient.connect();
promise.then(() => {
  db = mongoClient.db("myWallet");
});
promise.catch((e) => console.log(e));


app.post("/sign-up", async (req, res) => {
  const body = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-zA-Z]{3}[0-9]{2}$/).required()
  })

  const validation = schema.validate(body);

  try {
    const passwordHash = bcrypt.hashSync(body.password, 10);
    await db.collection("signup").insertOne({...body, password: passwordHash});
    res.sendStatus(201);
  } catch(e) {
    res.sendStatus(422);
  }
 
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("signup").findOne({email});
    if (user && bcrypt.compareSync(password, user.password)) {
      return res.sendStatus(201);
    } else {
      return res.sendStatus(422);
    }
  }catch(e) {
    res.sendStatus(500);
  }
});

app.listen(5000);