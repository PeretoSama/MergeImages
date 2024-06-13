document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('uploadForm');
  const fusionButton = document.getElementById('fusionButton');
  const serverImg = document.getElementById('serverImg');
  const serverImgLink = document.getElementById('serverImgLink');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const submitName = event.submitter.name;
    switch (submitName) {
      case 'mergeSubmit':
        fetch('/upload', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (response.ok) {
              return response.blob();
            } else {
              throw new Error('Error en la respuesta del servidor');
            }
          })
          .then(blob => {
            // Crear una URL temporal para mostrar la imagen
            const imageUrl = URL.createObjectURL(blob);

            serverImgLink.href = imageUrl;
            serverImg.src = imageUrl;
            serverImgLink.style.display = 'inline-block';
          })
          .catch(error => {
            // Manejar cualquier error que ocurra durante la solicitud
            console.error('Error al procesar la solicitud:', error);
            alert('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
          });
        break;
      case 'fusionSubmit':

        break;
    }
  });

  fusionButton.addEventListener('click', async function () {
    console.log(serverImg);
  });
});
