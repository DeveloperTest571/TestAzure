const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
  const resdata = {
    status: false,
    data: {},
    message: ''
  };

  try {
    if (req.headers.accesstoken) {
      const secretToken = req.headers.accesstoken;
      if (secretToken === process.env.APP_SECRET_KEY) {
        next();
      } else {
        resdata.message = 'Invalid token';
        res.status(401).json(resdata);
      }
    } else {
      resdata.message = 'No token provided';
      res.status(401).json(resdata);
    }
  } catch (error) {
    resdata.message = 'Invalid request';
    res.status(401).json(resdata);
  }
};