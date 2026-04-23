const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 📌 ROTAS
const authRoutes = require("./routes/auth");
const processosRoutes = require("./routes/processos");
const clientesRoutes = require("./routes/clientes");

// 📌 USO DAS ROTAS (CORRETO)
app.use("/auth", authRoutes);
app.use("/processos", processosRoutes);
app.use("/clientes", clientesRoutes);

// 📌 ROTA TESTE
app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

// 📌 SERVIDOR
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});