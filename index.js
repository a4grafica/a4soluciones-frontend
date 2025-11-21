const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./routes");
<<<<<<< HEAD
const upload = require("./middlewares/multerConfig");  // <--- AGREGAR ESTO
=======
>>>>>>> 3fae722c92aa0394740c682daa117078a674e8d7

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