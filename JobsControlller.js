// JobsController.js
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "jobs.json");

// Crear DB si no existe
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]), "utf8");
}

// Cargar desde archivo
function loadJobs() {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
}

// Guardar en archivo
function saveJobs(jobs) {
    fs.writeFileSync(DB_PATH, JSON.stringify(jobs, null, 2), "utf8");
}

module.exports = {
    // GET /jobs/pendientes
    listPendientes: (req, res) => {
        const jobs = loadJobs();
        const pendientes = jobs.filter(j => j.estado === "pendiente");

        return res.json(pendientes);
    },

    // POST /jobs/marcar-impreso
    marcarImpreso: (req, res) => {
        const { job_id } = req.body;

        if (!job_id)
            return res.status(400).json({ error: "Falta job_id" });

        const jobs = loadJobs();

        const index = jobs.findIndex(j => j.job_id === job_id);
        if (index === -1)
            return res.status(404).json({ error: "Job no encontrado" });

        jobs[index].estado = "impreso";
        jobs[index].fecha_impreso = new Date().toISOString();

        saveJobs(jobs);

        return res.json({ ok: true });
    },

    // 👉 Lo usa tu webhook para crear un trabajo
    agregarTrabajo: (file_id, file_path, tipo) => {
        const jobs = loadJobs();

        const newJob = {
            job_id: Date.now(), // ID único simple
            file_id,
            file_path,
            tipo,
            estado: "pendiente",
            fecha: new Date().toISOString()
        };

        jobs.push(newJob);
        saveJobs(jobs);

        return newJob;
    }
};