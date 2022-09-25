
export function errorHandler(err, req, res, next) {
  console.log(err);
  if(err.type) {
    return res.status(errorTypeToStatusCode(err.type)).send(err.message);
  }
  
  return res.sendStatus(500);
}

function errorTypeToStatusCode(errorType) {
  if (errorType === "conflict") return 409;
  if (errorType === "not_found") return 404;
  if (errorType === "unauthorized") return 401;
  if (errorType === "wrong_info") return 422;
  
  return 400;
}