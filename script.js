<<<<<<< HEAD
// Detectar backend (Netlify)
const BACKEND = "https://a4backend-elpr.onrender.com"; // URL real

const fileInput = document.getElementById("files");
const tipo = document.getElementById("tipo");
const precio = document.getElementById("precio");

let total = 0;

// ----------------------------
// Cálculo automático del total
// ----------------------------
function actualizarTotal() {
  const cantidad = fileInput.files.length;
  const precioUnit = Number(tipo.value);

  total = cantidad * precioUnit;
  precio.innerText = `Total: $${total}`;
}

fileInput.addEventListener("change", actualizarTotal);
tipo.addEventListener("change", actualizarTotal);

// ----------------------------
// INICIAR PROCESO DE PAGO
// ----------------------------
async function iniciarProceso() {
  if (fileInput.files.length === 0) {
    alert("Subí al menos 1 archivo.");
    return;
  }

  actualizarTotal();

  const formData = new FormData();
  for (let f of fileInput.files) formData.append("files", f);

  const ref = Date.now().toString();

  await fetch(`${BACKEND}/upload/${ref}`, {
    method: "POST",
    body: formData
  });

  const resp = await fetch(`${BACKEND}/create_order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: total,
      description: `Impresión A4 - Ref ${ref}`
    })
  });

  const data = await resp.json();

  if (!data.init_point) {
    alert("Error creando la orden.");
    return;
  }

  window.location.href = data.init_point;
}

// Hacer visible la función en el HTML
window.iniciarProceso = iniciarProceso;
=======
import { API_URL } from "./config.js";

// ------------------------------
// CALCULAR PRECIO
// ------------------------------
let precioActual = 0;

document.getElementById("files").addEventListener("change", calcular);
document.getElementById("tipo").addEventListener("change", calcular);

function calcular() {
  const cantidad = document.getElementById("files").files.length;
  const valor = Number(document.getElementById("tipo").value);

  precioActual = cantidad * valor;

  document.getElementById("precio").innerText = `Total: $${precioActual}`;
}

// ------------------------------
// INICIAR PROCESO
// ------------------------------
async function iniciarProceso() {
  const files = document.getElementById("files").files;

  if (files.length === 0) {
    alert("Seleccioná al menos un archivo.");
    return;
  }

  if (precioActual === 0) {
    alert("Seleccioná tipo de impresión.");
    return;
  }

  const ref = "A4-" + Date.now();

  // 1) SUBIR ARCHIVOS
  await uploadFiles(ref, files);

  // 2) CREAR ORDEN
  const data = await createOrder(precioActual, `Pedido de impresión ${ref}`);

  // 3) REDIRIGIR A MERCADOPAGO
  window.location.href = data.init_point;
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
>>>>>>> 3fae722c92aa0394740c682daa117078a674e8d7
