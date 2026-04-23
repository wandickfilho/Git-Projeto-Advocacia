const jwt = require("jsonwebtoken");

const SECRET = "segredo_super_forte";

function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "Token não enviado" });
    }

    const parts = header.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ message: "Formato do token inválido" });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({ message: "Token ausente" });
    }

    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Token inválido ou expirado"
    });
  }
}

module.exports = auth;