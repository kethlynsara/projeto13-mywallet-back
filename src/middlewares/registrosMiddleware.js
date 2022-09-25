import { registroSchema } from "../schemas/schemas.js";

export async function validateRegistrosData(req, res, next) {
    const data = req.body;

    const { error } = registroSchema.validate(data, {abortEarly: false});
    
    if (error) {
        return res.status(422).send(error.details.map((detail) => detail.message));
    }

    next();
}