const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// 1. Configuración de middlewares
app.use(cors()); // O configura CORS para tu dominio específico
app.use(express.json()); // Para parsear JSON en el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios

// 2. Definición del puerto (importante para Render)
const PORT = process.env.PORT || 3000;

// 3. Importación de las rutas (Asegúrate de que 'routes' es la carpeta que contiene tu routes.js)
const apiRoutes = require('./routes/routes'); 
app.use('/api', apiRoutes); // Usas el prefijo /api para tus rutas

// 4. Lógica para servir archivos estáticos (si aplica)
// app.use(express.static(path.join(__dirname, 'public'))); 

// 5. Servidor escuchando
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});