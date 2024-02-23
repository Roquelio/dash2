// Definir la URL del JSON
const url = 'https://test-gliv.onrender.com/verDatos';

// Almacenar el último ID procesado
let ultimoIdProcesado = null;

// Elemento de audio
const notificationSound = document.getElementById('notificationSound');

// Función para obtener y procesar el JSON
const obtenerYProcesarJSON = async () => {
  try {
    // Obtener el JSON desde la URL
    const response = await fetch(url);
    const datos = await response.json();

    // Verificar si hay datos
    if (datos.length > 0) {
      // Obtener el último elemento del JSON
      const ultimoElemento = datos[datos.length - 1];
      const id = ultimoElemento.ID;

      // Verificar si el ID es nuevo
      if (id !== ultimoIdProcesado) {
        // Actualizar el último ID procesado
        ultimoIdProcesado = id;

        // Reproducir el sonido
        notificationSound.play();

        // Actualizar elementos HTML con los datos del último ID
        document.getElementById('alert_type').innerText = ultimoElemento['Tipo de Alerta'];
        document.getElementById('difference').innerText = ultimoElemento.Diferencia;
        document.getElementById('buy_info').innerText = ultimoElemento['Información de Compra'];
        document.getElementById('price_buy').innerText = ultimoElemento['Precio de Compra'];
        document.getElementById('merchant').innerText = ultimoElemento.Merchant;
        document.getElementById('sell_info').innerText = ultimoElemento['Información de Venta'];
        document.getElementById('price_sell').innerText = ultimoElemento['Precio de Venta'];
        document.getElementById('arbitrage').innerText = ultimoElemento.Arbitraje;
        document.getElementById('date').innerText = ultimoElemento['Fecha de Creación'];

        // console.log('Datos del último ID procesado:');
        // console.log(ultimoElemento);
      }
    } else {
      console.log('No hay datos en el JSON.');
    }
  } catch (error) {
    console.error('Error al obtener o procesar el JSON:', error);
  }
};

// Establecer la función para ejecutar cada 5 segundos
setInterval(obtenerYProcesarJSON, 5000);

// También puedes ejecutar la función una vez inmediatamente para obtener los datos al cargar la página
obtenerYProcesarJSON();

// Agregar evento para detener las solicitudes al cerrar la página
window.addEventListener('beforeunload', function() {
  clearInterval(intervalId);
});

// Agregar evento para detener las solicitudes al cambiar de ruta (SPA)
window.addEventListener('hashchange', function() {
  clearInterval(intervalId);
});
