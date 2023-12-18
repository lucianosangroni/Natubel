const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Se requiere autorizacion' });
    }
    const token = req.headers.authorization.split(" ").pop();
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenData.username) {
      next();
    } else {
        return res.status(401).json({ message: 'Se requiere autorizacion' });
    }
  } catch (e) {
    return res.status(401).json({ message: 'Error de autorizacion' });
  }
};

module.exports = { checkAuth }