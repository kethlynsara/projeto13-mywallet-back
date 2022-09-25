import { schemaSignUp } from "../schemas/schemas.js";

export async function validateSignUpData(req, res, next) {
    const data = req.body;

    const { error } = schemaSignUp.validate(data, {abortEarly: false});
    
    if (error) {
        return res.status(422).send(error.details.map((detail) => detail.message));
    }

    if (data.senha1 !== data.senha2) {
        return res.status(422).send("Confira seus dados!");
    }  

    next();
}