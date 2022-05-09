import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../db.js";

import { schemaSignUp } from "../schemas/schemas.js";

export async function postSignUp(req, res) {
    const body = req.body;

    // const schemaSignUp = Joi.object({
    //   nome: Joi.string().required(),
    //   email: Joi.string().email().required(),
    //   senha1: Joi.number().required(),
    //   senha2: Joi.number().required(),
    // });
  
    const validation = schemaSignUp.validate(body);
  
    if (validation.error || body.senha1 !== body.senha2) {
      return res.status(422).send("Confira seus dados!");
    }
  
    try {
      const usuario = await db.collection("usuarios").findOne({ email: body.email });
  
      if (usuario) {
        return res.status(422).send("Usuário já cadastrado");
      }
  
      const senhaHash = bcrypt.hashSync(body.senha1, 10);
      delete body.senha1;
      delete body.senha2;
      await db.collection("usuarios").insertOne({ ...body, senha: senhaHash });
      res.sendStatus(201);
  
    } catch (e) {
      res.status(500).send("Não foi possível cadastrar usuário");
    }
}

export async function postSignIn(req, res) {
    const { email, senha } = req.body;

    try {
        const user = await db.collection("usuarios").findOne({ email });
        if (user && bcrypt.compareSync(senha, user.senha)) {
            const token = uuid();

            await db.collection("sessoes").insertOne({ userId: user._id, token });

            return res.status(201).send(token);
        } else {
            return res.status(401).send("Usuário não encontrado"); 
            }
   } catch (e) {
    res.status(500).send("Não foi possível fazer login do usuário");
   }
}