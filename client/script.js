const apiBaseUrl = `${window.location.origin}/api`;

document.getElementById('urlForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const input = document.getElementById('urlInput');
  const url = input.value.trim();

  if (!url) {
    alert('Por favor ingresa una URL.');
    return;
  }

  try {
    const res = await fetch(`${apiBaseUrl}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
      Enlace acortado: 
      <a href="${data.shortUrl}" target="_blank" class="text-blue-600 underline">
        ${data.shortUrl}
      </a>
    `;

    input.value = '';
  } catch (err) {
    console.error('Error al acortar URL:', err);
    alert('Hubo un error. Intenta de nuevo.');
  }
});
