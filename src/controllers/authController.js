import { authService } from "../services/authService.js";

export async function postSignUp(req, res) {
    const body = req.body;

    await authService.postSignUp(body);

    res.sendStatus(201);
}

export async function postSignIn(req, res) {
    const { email, senha } = req.body;

    const token = await authService.postSignIn(email, senha);

    res.status(200).send(token);
}