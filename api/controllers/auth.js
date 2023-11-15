const { adminModel } = require("../modelos");
const { matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
      req = matchedData(req);

      console.log(req)

      const admin = await adminModel.findOne({ where: { nombre_usuario: req.nombre_usuario } });
      if (!admin) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const checkPassword = await bcrypt.compare(req.password, admin.password);

      if (!checkPassword) {
        return res.status(403).json({ message: 'Contraseña incorrecta' });
      }

      const tokenJwt = jwt.sign({ id: admin.id }, process.env.JWT_SECRET,{ expiresIn: "10h" })

      res.status(201).json({ message: 'Inicio de sesion exitoso', jwt: tokenJwt });
    } catch (e) {
        res.status(500).json({ message: 'Error al iniciar sesion' });
    }
  };

module.exports = { login };