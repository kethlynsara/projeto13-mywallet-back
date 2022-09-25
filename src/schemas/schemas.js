import Joi from "joi";

export const schemaSignUp = Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha1: Joi.string().alphanum().min(6).required(),
    senha2: Joi.ref("senha1")
});

export const registroSchema = Joi.object({
    valor: Joi.string()
      .pattern(/(^[0-9]+,[0-9]+$)|(^[0-9]+$)/)
      .required(),
    descricao: Joi.string().required(),
    tipo: Joi.string().required(),
  });