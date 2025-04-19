const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

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

const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.post('/api/shorten', (req, res) => {
    const { url } = req.body;
    console.log('URL recibida:', url);
    const id = generarIdAleatorio();
    urls[id] = url;
    console.log('URL almacenada:', urls[id]);
    res.json({ id, shortUrl: `${BASE_URL}/${id}` });
});

app.get('/:id', (req, res) => {
    const { id } = req.params;
    const originalUrl = urls[id];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL no encontrada');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${BASE_URL}`);
});