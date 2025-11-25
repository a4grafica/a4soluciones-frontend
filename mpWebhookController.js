const path = require("path");
const fs = require("fs");
// 🚨 NECESITAS QUE EL SDK ESTÉ CONFIGURADO CON EL access_token
const mercadopago = require("mercadopago"); 

const dbPath = path.join(__dirname, "../db.json");

function readDB() {
    return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ----------------------------------------------------
// 🚨 FUNCIÓN WEBHOOK CORREGIDA (DEBE SER ASYNC)
// ----------------------------------------------------
exports.mercadoPagoWebhook = async (req, res) => {
    try {
        const paymentData = req.body;

        // 1. Verificación básica: Ignorar notificaciones que no son de pago.
        if (paymentData.type !== "payment") {
            return res.sendStatus(200);
        }

        // 2. Extraer el ID de la transacción (Payment ID)
        const paymentId = paymentData.data.id;
        
        // 3. CONSULTAR LA API DE MP para obtener detalles completos (status y external_reference)
        const mpResponse = await mercadopago.payment.get(paymentId);
        const paymentDetail = mpResponse.body;
        
        // 4. Verificar el estado y obtener el Job ID (external_reference)
        if (paymentDetail.status === 'approved' && paymentDetail.external_reference) {
            
            const jobId = paymentDetail.external_reference;
            
            // 5. Buscar y actualizar el trabajo en db.json
            const db = readDB();
            // Busca por el ID que creaste en uploadController
            const job = db.jobs.find(j => j.id === jobId); 

            if (job) {
                console.log(`Job encontrado: ${jobId}. Marcando como listo para imprimir.`);
                job.status = "ready_to_print";
                writeDB(db);
            } else {
                console.log(`Error: No se encontró trabajo con ID: ${jobId}`);
            }
        }
        
        // Es crucial devolver 200 OK a Mercado Pago para indicar que se recibió la notificación
        return res.sendStatus(200);

    } catch (err) {
        console.error("Error en el Webhook de Mercado Pago:", err);
        // Si hay un error, devolvemos 500 para que MP lo reintente (o 200 si prefieres evitar el reintento excesivo)
        return res.sendStatus(500); 
    }
};

// ... (El resto de tus funciones como getReadyJobs y markPrinted quedan igual)