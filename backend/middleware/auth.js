const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  const token = header.split(" ")[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, "segredo_super_forte");

    req.user = decoded; // guarda usuário logado

    next(); // libera acesso
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = auth;