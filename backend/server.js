const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
const processosRoutes = require("./routes/processos");

app.use("/processos", processosRoutes);