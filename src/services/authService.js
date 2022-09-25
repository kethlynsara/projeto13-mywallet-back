import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import database from "../database.js";

async function postSignUp(body) {  
    const usuario = await database.collection("usuarios").findOne({ email: body.email });

    if (usuario) {
        throw {
            type: "wrong_info",
            message: "Usuário já cadastrado!"
        }
    }

    const senhaHash = bcrypt.hashSync(body.senha1, 10);
    delete body.senha1;
    delete body.senha2;
    await database.collection("usuarios").insertOne({ ...body, senha: senhaHash });
}

async function postSignIn(email, senha) {
    const user = await database.collection("usuarios").findOne({ email });

    if (user && bcrypt.compareSync(senha, user.senha)) {
        const token = uuid();
        await database.collection("sessoes").insertOne({ userId: user._id, token });
        return token;
    } else {
        throw {
            type: "not_found",
            message: "Usuário não encontrado!"
        }
    }
}

export const authService = {
    postSignUp,
    postSignIn
}