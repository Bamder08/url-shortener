const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // <-- usa .env

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const DB_PATH = path.join(__dirname, 'urls.json');

// Middlewares
app.use(cors());
app.use(express.json());

// Cargar URLs desde el archivo si existe
let urls = {};
if (fs.existsSync(DB_PATH)) {
  urls = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

// Generador de IDs
function generarIdAleatorio(longitud = 6) {
  const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: longitud }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('');
}

// POST /api/shorten
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL es requerida' });

  const id = generarIdAleatorio();
  urls[id] = url;

  // Guardar en archivo
  fs.writeFileSync(DB_PATH, JSON.stringify(urls, null, 2));

  res.json({ id, shortUrl: `${BASE_URL}/${id}` });
});

// GET /:id
app.get('/:id', (req, res) => {
  const originalUrl = urls[req.params.id];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('URL no encontrada');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${BASE_URL}`);
});
