import { registrosService } from "../services/registrosService.js";

export async function postRegistros(req, res) {
  const registro = req.body;
  const { token } = res.locals;
  const { valor, descricao, tipo } = registro;

  await registrosService.postRegistros(valor, descricao, tipo, token);

  res.sendStatus(201);
}

export async function getRegistros(req, res) {
    const { token } = res.locals;

    const registros = await registrosService.getRegistros(token);
  
    res.send(registros);
}
