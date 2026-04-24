const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve os arquivos de upload (fotos e documentos) como estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📌 ROTAS
const authRoutes      = require("./routes/auth");
const processosRoutes = require("./routes/processos");
const clientesRoutes  = require("./routes/clientes");

app.use("/auth",      authRoutes);
app.use("/processos", processosRoutes);
app.use("/clientes",  clientesRoutes);

app.get("/", (req, res) => res.send("Backend funcionando!"));

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});