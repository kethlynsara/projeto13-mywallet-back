import { MongoClient, ObjectId } from "mongodb";
import express, { response } from "express";
//import cors from "cors";
import Joi from "joi";
import dayjs from "dayjs";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha1: Joi.number().required(),
    senha2: Joi.number().required()
  })

  const validation = schema.validate(body);

  if (validation.error || body.senha1 !== body.senha2) {
    return res.status(422).send("Confira seus dados!");
    
  }

  try {
    const senhaHash = bcrypt.hashSync(body.senha1, 10);
    delete body.senha1;
    delete body.senha2;
    await db.collection("usuarios").insertOne({...body, senha: senhaHash});
    res.sendStatus(201);
  } catch(e) {
    res.status(500).send("Não foi possível cadastrar usuário"); 
  } 
});

app.post("/sign-in", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await db.collection("usuarios").findOne({email});
    if (user && bcrypt.compareSync(senha, user.senha)) {
      const token = uuid();

      await db.collection("sessoes").insertOne({userId: user._id, token});

      return res.sendStatus(201);
    } else {
      return res.status(401).send("Usuário não encontrado"); //user não encontrado
    }
  }catch(e) {
    res.status(500).send("Não foi possível fazer login do usuário"); 
  }
});

app.post("/registros", async (req, res) => {
  const registro = req.body;

  const registroSchema = Joi.object({
    valor: Joi.number().required(),
    descricao: Joi.string().required(),
    tipo: Joi.string().required(),
    token: Joi.string().required()
  });

  const validacao = registroSchema.validate(registro);

  if (validacao.error) {
    return res.status(422).send("Confira seus dados!");
  }

  try {
    const { valor, descricao, tipo, token } = registro;

    const sessao = await db.collection("sessoes").findOne({token});

    if (!sessao) {
      return res.status(401).send("Usuário não encontrado");
    }

    await db.collection("registros").insertOne({valor, descricao, tipo, userId: sessao._id, data: dayjs().format('DD/MM')});

    res.sendStatus(201);
  }catch(e) {
    res.status(500).send("Não foi possível fazer o registro");
  }

});

// app.get("/registros", (req, res) => {
//   const { authorization } = req.header;
//   console.log(authorization)
//   const token = authorization?.replace("Bearer", "");
//   console.log(token);
// });

app.listen(5000);