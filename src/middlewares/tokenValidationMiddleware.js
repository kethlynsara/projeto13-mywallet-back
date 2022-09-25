 async function tokenValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
  
    if (!token) {
        return res.status(401).send("Token inválido!");
    }

    res.locals.token = token;

    next();
}

export default tokenValidation;