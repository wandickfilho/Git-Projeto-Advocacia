const express = require("express");
const router = express.Router();
const db = require("../db");


// 📌 CADASTRAR PROCESSO
router.post("/create", (req, res) => {
  const {
    numero_processo,
    nome_cliente,
    tipo_acao,
    data_protocolo,
    cpf_cliente,
    adv_id
  } = req.body;

  db.query(
    `INSERT INTO processos 
    (numero_processo, nome_cliente, tipo_acao, data_protocolo, cpf_cliente, adv_id)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [numero_processo, nome_cliente, tipo_acao, data_protocolo, cpf_cliente, adv_id],
    (err, result) => {
      if (err) {
        console.error("ERRO AO CRIAR PROCESSO:", err);
        return res.json({ message: "Erro ao cadastrar processo" });
      }

      res.json({ message: "Processo cadastrado com sucesso!" });
    }
  );
});


// 📌 LISTAR TODOS
router.get("/", (req, res) => {
  db.query("SELECT * FROM processos", (err, results) => {
    if (err) {
      console.error(err);
      return res.json({ message: "Erro ao buscar processos" });
    }

    res.json(results);
  });
});


// 📌 FILTRO
router.get("/search", (req, res) => {
  const { termo } = req.query;

  db.query(
    `SELECT * FROM processos 
     WHERE nome_cliente LIKE ? 
     OR numero_processo LIKE ?`,
    [`%${termo}%`, `%${termo}%`],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ message: "Erro na busca" });
      }

      res.json(results);
    }
  );
});

module.exports = router;