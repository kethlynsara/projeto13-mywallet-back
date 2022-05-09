import Joi from "joi";
import dayjs from "dayjs";
import db from "../db.js";

import { registroSchema } from "../schemas/schemas.js";

export async function postRegistros(req, res) {
  const registro = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer", "").trim();

  const validacao = registroSchema.validate(registro);

  if (validacao.error) {
    return res.status(422).send("Confira seus dados!");
  }

  try {
    const { valor, descricao, tipo } = registro;

    const sessao = await db.collection("sessoes").findOne({ token });

    if (!sessao) {
      return res.status(401).send("Usuário não encontrado");
    }

    await db.collection("registros").insertOne({
      valor,
      descricao,
      tipo,
      token,
      userId: sessao.userId,
      data: dayjs().format("DD/MM"),
    });

    res.sendStatus(201);
  } catch (e) {
    res.status(500).send("Não foi possível fazer o registro");
  }
}

export async function getRegistros(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
  
    try {
      const sessao = await db.collection("sessoes").findOne({token});
  
      if (!sessao) {
        res.status(401).send("Sessão expirou!");
      }
  
      const usuario = await db.collection("usuarios").findOne({_id: sessao.userId});
      const { nome } = usuario;
      
      if (usuario) {
        const registros = await db.collection("registros").find({userId: sessao.userId}).toArray();
        if (registros) {
          return res.status(201).send([...registros, nome]);
        } 
      } else {
        return res.status(401).send("Usuário não encontrado")
      }   
      
    }catch(e) {
      res.sendStatus(500);
    }
}
