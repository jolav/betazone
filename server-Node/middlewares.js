/* */

class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, AppError);
  }
}

const mw = {
  logger: function (req, res, next) {
    console.log(
      this.getIP(req),
      req.method,
      req.originalUrl
    );
    next();
  },
  getIP: function (req) {
    return (
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress).split(',')[0];
  },
  sendResult: function (res, status, data, pretty) {
    if (pretty) {
      res.header('Content-Type', 'application/json');
      res.status(status).send(JSON.stringify(data, null, 2));
      return;
    }
    res.status(status).json(data);
  }
};

export {
  AppError,
  mw,
};
