
const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth");

//////////////////////////////
// 📌 CRIAR PROCESSO
//////////////////////////////
router.post("/", auth, (req, res) => {
  const {
    numero_processo,
    nome_cliente,
    cpf_cliente,
    tipo_acao,
    status_processo,
    data_protocolo,
    descricao,
    adv_id
  } = req.body;

  db.query(
    `INSERT INTO processos 
    (numero_processo, nome_cliente, cpf_cliente, tipo_acao, status_processo, data_protocolo, descricao, adv_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      numero_processo,
      nome_cliente,
      cpf_cliente,
      tipo_acao,
      status_processo,
      data_protocolo,
      descricao,
      adv_id
    ],
    (err, result) => {
      if (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({ message: "Erro ao criar processo" });
      }

      res.status(201).json({ message: "Processo criado com sucesso" });
    }
  );
});

//////////////////////////////
// 📌 LISTAR PROCESSOS
//////////////////////////////
router.get("/", auth, (req, res) => {
  db.query(
    `SELECT * FROM processos ORDER BY id_processo DESC`,
    (err, results) => {
      if (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({
          message: "Erro ao buscar processos"
        });
      }

      res.json(results);
    }
  );
});

//////////////////////////////
// ✏️ ATUALIZAR PROCESSO (FALTAVA ISSO)
//////////////////////////////
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;

  const {
    numero_processo,
    nome_cliente,
    cpf_cliente,
    tipo_acao,
    status_processo,
    data_protocolo
  } = req.body;

  db.query(
    `UPDATE processos SET
      numero_processo = ?,
      nome_cliente = ?,
      cpf_cliente = ?,
      tipo_acao = ?,
      status_processo = ?,
      data_protocolo = ?
     WHERE id_processo = ?`,
    [
      numero_processo,
      nome_cliente,
      cpf_cliente,
      tipo_acao,
      status_processo,
      data_protocolo,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("ERRO SQL UPDATE:", err);
        return res.status(500).json({
          message: "Erro ao atualizar processo"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Processo não encontrado"
        });
      }

      res.json({
        message: "Processo atualizado com sucesso"
      });
    }
  );
});

module.exports = router;