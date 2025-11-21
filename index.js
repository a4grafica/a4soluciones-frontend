const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

// Carpeta para archivos subidos
app.use("/files", express.static(path.join(__dirname, "files")));

// Rutas principales
app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend funcionando en puerto ${PORT}`);
});