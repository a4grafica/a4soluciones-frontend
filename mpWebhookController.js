const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

exports.mercadoPagoWebhook = (req, res) => {
  try {
    const payment = req.body;

    if (payment.type !== "payment") {
      return res.sendStatus(200);
    }

    // id de preferencia → relacionarlo con job
    const preferenceId = payment.data.id;

    const db = readDB();
    const job = db.jobs.find(j => j.preference_id == preferenceId);

    if (job) {
      job.status = "ready_to_print";
      writeDB(db);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};