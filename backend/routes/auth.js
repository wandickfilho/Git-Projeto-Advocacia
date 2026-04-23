const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// CADASTRO
router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);

    db.query(
  "INSERT INTO cadastroAdvogado (nome_adv, email, senha_adv) VALUES (?, ?, ?)",
  [nome, email, hash],
  (err, result) => {
    if (err) {
      console.error("ERRO SQL:", err); // 👈 ESSENCIAL
      return res.json({ message: "Erro ao cadastrar" });
    }

    console.log("SALVOU NO BANCO:", result); // 👈 ESSENCIAL

    res.json({ message: "Usuário cadastrado com sucesso!" });
  }
);
  } catch (err) {
    console.error("ERRO NO CADASTRO:", err);
    res.json({ message: "Erro interno" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query(
    "SELECT * FROM cadastroAdvogado WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("ERRO NO LOGIN:", err);
        return res.json({ message: "Erro interno" });
      }

      if (results.length === 0) {
        return res.json({ message: "Usuário não encontrado" });
      }

      const user = results[0];

      const match = await bcrypt.compare(senha, user.senha_adv);

      if (!match) {
        return res.json({ message: "Senha incorreta" });
      }

      res.json({
        user: {
          id: user.id,
          nome: user.nome_adv,
          email: user.email
        }
      });
    }
  );
});

module.exports = router;