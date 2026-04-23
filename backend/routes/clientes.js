const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// =========================
// 📌 CRIAR CLIENTE (SEM FOTO POR ENQUANTO)
// =========================
router.post("/", auth, (req, res) => {
  const { nome, cpf, senha_gov } = req.body;

  db.query(
    "INSERT INTO clientes (nome, cpf, senha_gov) VALUES (?, ?, ?)",
    [nome, cpf, senha_gov],
    (err, result) => {
      if (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({ message: "Erro ao criar cliente" });
      }

      res.status(201).json({
        message: "Cliente criado com sucesso",
        id_cliente: result.insertId
      });
    }
  );
});

// =========================
// 📌 LISTAR CLIENTES
// =========================
router.get("/", auth, (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar clientes" });
    }

    res.json(results);
  });
});

// =========================
// 📌 BUSCAR CLIENTE POR ID
// =========================
router.get("/:id", auth, (req, res) => {
  db.query(
    "SELECT * FROM clientes WHERE id_cliente = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao buscar cliente" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      res.json(results[0]);
    }
  );
});

module.exports = router;