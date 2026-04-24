const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const db   = require("../db");
const auth = require("../middleware/auth");

//////////////////////////////
// 📁 CONFIGURAÇÃO DO MULTER
//////////////////////////////
const pastaFotos = path.join(__dirname, "../uploads/fotos");
const pastaDocs  = path.join(__dirname, "../uploads/documentos");
if (!fs.existsSync(pastaFotos)) fs.mkdirSync(pastaFotos, { recursive: true });
if (!fs.existsSync(pastaDocs))  fs.mkdirSync(pastaDocs,  { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === "fotos" ? pastaFotos : pastaDocs);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
const uploadCampos = upload.fields([
  { name: "fotos",      maxCount: 20 },
  { name: "documentos", maxCount: 20 }
]);

//////////////////////////////
// 📌 CRIAR PROCESSO
//////////////////////////////
router.post("/", auth, uploadCampos, (req, res) => {
  const {
    numero_processo, nome_cliente, cpf_cliente,
    tipo_acao, status_processo, data_protocolo,
    descricao, adv_id
  } = req.body;

  const fotos      = JSON.stringify((req.files?.fotos      || []).map(f => f.filename));
  const documentos = JSON.stringify((req.files?.documentos || []).map(f => f.filename));

  db.query(
    `INSERT INTO processos
      (numero_processo, nome_cliente, cpf_cliente, tipo_acao, status_processo, data_protocolo, descricao, adv_id, fotos, documentos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [numero_processo, nome_cliente, cpf_cliente, tipo_acao, status_processo, data_protocolo, descricao, adv_id, fotos, documentos],
    (err) => {
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
        return res.status(500).json({ message: "Erro ao buscar processos" });
      }
      res.json(results);
    }
  );
});

//////////////////////////////
// ✏️ ATUALIZAR PROCESSO
//////////////////////////////
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const {
    numero_processo, nome_cliente, cpf_cliente,
    tipo_acao, status_processo, data_protocolo
  } = req.body;

  db.query(
    `UPDATE processos SET
      numero_processo = ?, nome_cliente = ?, cpf_cliente = ?,
      tipo_acao = ?, status_processo = ?, data_protocolo = ?
     WHERE id_processo = ?`,
    [numero_processo, nome_cliente, cpf_cliente, tipo_acao, status_processo, data_protocolo, id],
    (err, result) => {
      if (err) {
        console.error("ERRO SQL UPDATE:", err);
        return res.status(500).json({ message: "Erro ao atualizar processo" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Processo não encontrado" });
      }
      res.json({ message: "Processo atualizado com sucesso" });
    }
  );
});

//////////////////////////////
// 🗑️ EXCLUIR PROCESSO
//////////////////////////////
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;

  // Busca os arquivos antes de deletar para removê-los do disco
  db.query(
    `SELECT fotos, documentos FROM processos WHERE id_processo = ?`,
    [id],
    (err, rows) => {
      if (err || !rows.length) {
        return res.status(404).json({ message: "Processo não encontrado" });
      }

      const processo = rows[0];

      // Parse seguro dos JSON
      let fotos = [], docs = [];
      try { fotos = JSON.parse(processo.fotos || "[]"); } catch {}
      try { docs  = JSON.parse(processo.documentos || "[]"); } catch {}

      // Deleta do banco
      db.query(
        `DELETE FROM processos WHERE id_processo = ?`,
        [id],
        (err2) => {
          if (err2) {
            console.error("ERRO SQL DELETE:", err2);
            return res.status(500).json({ message: "Erro ao excluir processo" });
          }

          // Remove arquivos do disco (silencioso se não existir)
          fotos.forEach(nome => {
            const p = path.join(pastaFotos, nome);
            if (fs.existsSync(p)) fs.unlinkSync(p);
          });
          docs.forEach(nome => {
            const p = path.join(pastaDocs, nome);
            if (fs.existsSync(p)) fs.unlinkSync(p);
          });

          res.json({ message: "Processo excluído com sucesso" });
        }
      );
    }
  );
});

module.exports = router;