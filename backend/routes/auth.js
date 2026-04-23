const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "segredo_super_forte"; // depois pode ir pro .env

// =========================
// 🔐 REGISTER
// =========================
router.post("/register", async (req, res) => {
  console.log("🔥 REGISTER CHAMADO:", req.body);

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    db.query(
      "INSERT INTO cadastroAdvogado (nome_adv, email, senha_adv) VALUES (?, ?, ?)",
      [nome, email, hash],
      (err, result) => {
        if (err) {
          console.error("❌ ERRO SQL:", err);

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email já cadastrado" });
          }

          return res.status(500).json({ message: "Erro ao cadastrar" });
        }

        console.log("✅ SALVO:", result);

        return res.status(201).json({
          message: "Usuário cadastrado com sucesso!"
        });
      }
    );

  } catch (err) {
    console.error("❌ ERRO:", err);
    return res.status(500).json({ message: "Erro interno" });
  }
});


// =========================
// 🔑 LOGIN
// =========================
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha email e senha" });
  }

  db.query(
    "SELECT * FROM cadastroAdvogado WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("ERRO LOGIN:", err);
        return res.status(500).json({ message: "Erro interno" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const user = results[0];

      const match = await bcrypt.compare(senha, user.senha_adv);

      if (!match) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        token,
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