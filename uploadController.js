const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Base de datos simple en JSON (puede ser Mongo o lo que uses)
const dbPath = path.join(__dirname, "../db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

exports.uploadFile = (req, res) => {
  const file = req.file; // viene desde multer
  const tipo = req.body.tipo;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const db = readDB();

  const job = {
    id: uuidv4(),
    file_url: `https://a4-backend.onrender.com/uploads/${file.filename}`,
    tipo,
    status: "pending_payment",
    created_at: Date.now(),
  };

  db.jobs.push(job);
  writeDB(db);

  return res.json(job);
};