const jwt = require("jsonwebtoken");

exports.createJsonToken = async (payload, expired) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: expired,
      },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};

exports.createReFreshToken = async (payload, expired) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: expired,
      },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};
exports.verifyAccessToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.JWT_ACCESS_KEY}`, (error, payload) => {
      if (error) {
        //console.log(error);
        reject(error);
      } else {
        //console.log(resolve());
        resolve(payload);
      }
    });
  });
};
exports.verifyRefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.JWT_REFRESH_KEY}`, (error, payload) => {
      if (error) {
        reject(error);
      } else {
        resolve(payload);
      }
    });
  });
};
