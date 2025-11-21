const express = require("express");
const router = express.Router();

const upload = require('../middlewares/multerConfig');
const uploadCtrl = require("./controllers/uploadController");
const jobsCtrl = require("./controllers/jobsController");
const mpWebhookCtrl = require("./controllers/mpWebhookController");

// subir archivo y crear job
router.post("/upload", upload.single("file"), uploadCtrl.uploadFile);

// webhook de mercadopago
router.post("/webhook/mp", mpWebhookCtrl.mercadoPagoWebhook);

// jobs para la impresora
router.get("/jobs/ready", jobsCtrl.getReadyJobs);
router.post("/jobs/:id/printed", jobsCtrl.markPrinted);

module.exports = router;