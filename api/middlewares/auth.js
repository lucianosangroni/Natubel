const checkAuth = async (req, res, next) => {
  try {
    console.log(req.headers)
    console.log(process.env.TOKEN_BEARER)

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Se requiere autorizacion' });
    }
    const token = req.headers.authorization.split(" ").pop();

    if (token === process.env.TOKEN_BEARER) {
      next();
    } else {
        return res.status(401).json({ message: 'Se requiere autorizacion' });
    }
  } catch (e) {
    return res.status(401).json({ message: 'Error de autorizacion' });
  }
};

module.exports = { checkAuth }