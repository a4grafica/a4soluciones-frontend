// --- CONFIGURACIÓN ---
// URL CORRECTA del backend de Render
const API_URL = "https://a4backend-elpr.onrender.com";

// Elementos del DOM
const fileInput = document.getElementById("files");
const tipo = document.getElementById("tipo");
const precio = document.getElementById("precio");

// ------------------------------
// CALCULAR PRECIO
// ------------------------------
let precioActual = 0;

// Escuchas para actualizar el precio
fileInput.addEventListener("change", calcular);
tipo.addEventListener("change", calcular);

function calcular() {
    const cantidad = fileInput.files.length;
    const valor = Number(tipo.value);

    precioActual = cantidad * valor;

    precio.innerText = `Total: $${precioActual}`;
}

// ------------------------------
// SUBIR ARCHIVOS
// ------------------------------
async function uploadFiles(ref, files) {
    const formData = new FormData();

    for (const f of files) {
        formData.append("files", f);
    }
    
    const r = await fetch(`${API_URL}/upload/${ref}`, {
        method: "POST",
        body: formData,
    });

    return await r.json();
}

// ------------------------------
// CREAR ORDEN MERCADOPAGO
// ------------------------------
async function createOrder(amount, description) {
    const r = await fetch(`${API_URL}/create_order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
    });

    return await r.json();
}

// ------------------------------
// INICIAR PROCESO DE PAGO
// ------------------------------
async function iniciarProceso() {
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Seleccioná al menos un archivo.");
        return;
    }

    // Asegurar que el precio se calcule antes de continuar
    calcular(); 

    if (precioActual === 0) {
        alert("Seleccioná tipo de impresión.");
        return;
    }

    const ref = "A4-" + Date.now();
    const description = `Pedido de impresión ${ref}`;

    try {
        // 1) SUBIR ARCHIVOS (Llama a la API de Render)
        await uploadFiles(ref, files);

        // 2) CREAR ORDEN (Llama a la API de Render)
        const data = await createOrder(precioActual, description);

        // CORRECCIÓN FINAL: Esperamos 'url' que es la propiedad que envía el backend
        if (!data.url) { 
            alert("Error creando la orden: No se recibió URL de pago.");
            return;
        }

        // 3) REDIRIGIR A MERCADOPAGO
        window.location.href = data.url; 

    } catch (error) {
        console.error("Error fatal en el proceso de pago:", error);
        alert("Ocurrió un error inesperado. Intentalo de nuevo más tarde.");
    }
}

// Hacer visible la función en el HTML (para que el botón funcione)
window.iniciarProceso = iniciarProceso;