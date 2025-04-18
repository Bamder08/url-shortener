// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

const urls = {};

function generarIdAleatorio(longitud = 6) {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < longitud; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      id += caracteres[randomIndex];
    }
    return id;
  }
  

// Ruta de prueba
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  console.log('URL recibida:', url);
  const id = generarIdAleatorio();
  urls[id] = url;
  console.log('URL almacenada:', urls[id]);
  res.json({ id, shortUrl: `http://localhost:3000/${id}` });
});

app.get('/:id', (req, res) => {
    const { id } = req.params;
    const originalUrl = urls[id];
  
    if (originalUrl) {
      // Si existe, redirige
      res.redirect(originalUrl);
    } else {
      // Si no existe, responde con error
      res.status(404).send('URL no encontrada');
    }
  });
  

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
