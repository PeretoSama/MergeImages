// document.addEventListener('DOMContentLoaded', function () {
//   const form = document.getElementById('uploadForm');

//   form.addEventListener('submit', function (event) {
//     // Evitar que se envíe el formulario de forma predeterminada
//     event.preventDefault();

//     // Obtener el formulario
//     const formData = new FormData(form);

//     // Enviar el formulario al servidor usando fetch
//     fetch('/upload', {
//       method: 'POST',
//       body: formData
//     })
//       .then(response => {
//         if (response.ok) {
//         // Procesar la respuesta del servidor como JSON
//           return response.json();
//         } else {
//         // Si la respuesta del servidor no es exitosa, lanzar un error
//           throw new Error('Error en la respuesta del servidor');
//         }
//       })
//       .then(data => {
//       // Manejar la respuesta del servidor
//       // En este ejemplo, asumimos que el servidor devuelve una URL en formato JSON
//         const isConfirmed = window.confirm(`¿Deseas ir a ${data.url}?`);
//         if (isConfirmed) {
//           window.location.href = data.url;
//         }
//       })
//       .catch(error => {
//       // Manejar cualquier error que ocurra durante la solicitud
//         console.error('Error al procesar la solicitud:', error);
//         alert('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
//       });
//   });
// });
