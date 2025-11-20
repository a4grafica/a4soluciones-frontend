import express from "express";
import cors from "cors";
import multer from "multer";
import mercadopago from "mercadopago";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// CONFIG MERCADO PAGO
// -------------------------------
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// -------------------------------
// CREAR ORDEN
// -------------------------------
app.post("/create_order", async (req, res) => {
  const { amount, description } = req.body;

  try {
    const preference = await mercadopago.preferences.create({
      items: [{
        title: description,
        quantity: 1,
        currency_id: "ARS",
        unit_price: Number(amount)
      }],
      notification_url: process.env.WEBHOOK_URL
    });

    res.json({ init_point: preference.body.init_point });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando la orden" });
  }
});

// -------------------------------
// WEBHOOK MP
// -------------------------------
app.post("/webhook", (req, res) => {
  console.log("Webhook recibido:", req.body);
  res.sendStatus(200);
});

// -------------------------------
// UPLOAD ARCHIVOS
// -------------------------------
const upload = multer({ dest: "files/" });

app.post("/upload/:ref", upload.array("files"), (req, res) => {
  console.log("Archivos recibidos:", req.files);
  res.json({ status: "ok" });
});

// -------------------------------

app.get("/", (req, res) => {
  res.send("Backend A4 Soluciones funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor activo en puerto", PORT));
