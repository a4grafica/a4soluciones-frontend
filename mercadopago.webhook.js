exports.markPrinted = (req, res) => {
  const id = req.params.id;

  const db = readDB();
  const job = db.jobs.find(j => j.id === id);

  if (!job) return res.status(404).json({ error: "Job not found" });

  job.status = "printed";
  job.printed_at = Date.now();

  writeDB(db);

  return res.json({ message: "OK" });
};