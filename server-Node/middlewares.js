/* */

function logger(req, res, next) {
  console.log(
    new Date().toUTCString(),
    getIP(req),
    req.method,
    req.originalUrl
  );
  next();
}

function getIP(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress).split(',')[0];
}

export {
  logger
};
