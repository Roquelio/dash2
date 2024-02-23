// Función para obtener los precios de los pares y mostrarlos
function obtenerPrecios() {
    const pares = ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT', 'BNBUSDT', 'DAIUSDT', 'XRPUSDT', 'ADAUSDT'];
    const url = 'https://api.binance.com/api/v3/ticker/price';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            pares.forEach(par => {
                const precio = data.find(item => item.symbol === par);
                if (precio) {
                    const elemento = document.getElementById(par.substring(0, par.length - 4).toLowerCase());
                    if (elemento) {
                        elemento.textContent = `${par.substring(0, par.length - 4)}: ${precio.price}`;
                    }
                }
            });
        })
        .catch(error => console.error('Error al obtener precios:', error));
}

// Ejecutar la función inicialmente y luego cada 2 minutos
obtenerPrecios();
setInterval(obtenerPrecios, 120000); // 2 minutos = 120000 milisegundos
