import dayjs from "dayjs";
import database from "../database.js";

async function findSession(token) {
    const sessao = await database.collection("sessoes").findOne({ token });
    if (!sessao) {
        throw {
            type: "unauthorized",
            message: "Sessão não encontrada!"
        }
    }
    return sessao;
}

async function getRegistros(token) {
    const sessao = await findSession(token);    
    const usuario = await database.collection("usuarios").findOne({_id: sessao.userId});
    const { nome } = usuario;

    if (usuario) {
        const registros = await database.collection("registros").find({userId: sessao.userId}).toArray();
        if (registros) {
          return [...registros, nome];
        } 
      } else {
          throw {
              type: "unauthorized",
              message: "Usuário não encontrado"
          }
      } 
}

async function postRegistros(valor, descricao, tipo, token) {
    const sessao = await findSession(token);

    await database.collection("registros").insertOne({
      valor,
      descricao,
      tipo,
      token,
      userId: sessao.userId,
      data: dayjs().format("DD/MM"),
    });
}

export const registrosService = {
    getRegistros,
    postRegistros
}