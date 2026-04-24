const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "toninho1006",
  database: "advocacia"
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Banco conectado!");
  }
});

module.exports = db;