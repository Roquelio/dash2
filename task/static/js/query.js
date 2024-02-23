let limite = 50;

let inicioCMppc = [];
let inicioCMppv = [];
let iniciobudappc = [];
let iniciobudappv = [];
let iniciovitappc = [];
let iniciovitappv = [];
let inicioorionppc = [];
let iniciorionppv = [];
let iniciootcppc = [];
let iniciobinanceppc = [];
let inicibinanceppv = [];

function extractCurrencyPair(message) {
    const regex = /\[([^\]]+)\]/;
    const matches = regex.exec(message);
    return matches && matches[1] ? matches[1] : 'N/A';
}

function agregarDatosYReiniciar(arreglo, nuevoDato, limite) {
    arreglo.push(nuevoDato);

    // Verificar si el arreglo ha alcanzado el límite
    if (arreglo.length >= limite) {
        // Reiniciar el arreglo asignándole uno nuevo vacío
        arreglo = [];
    }

    return arreglo;
}


function getSourceName(value, ...prices) {
    const index = prices.findIndex(price => price === value);
    const exchanges = ['Cryptomarket', 'Buda', 'Vita', 'Orion', 'Binance','Buda OTC', 'Orion OTC', 'Kundai OTC', ];
    const exchangeName = exchanges[index] || 'N/A';
    const currencyPair = extractCurrencyPair(value);
    
    return { exchange: exchangeName, currencyPair: currencyPair };
}


function getPriceValues(data) {
    const sources = ['cm', 'buda', 'vita', 'orion', 'otc', 'binance'];

    const prices = {};

    for (const source of sources) {
        if (data[source] && data[source].message) {
            const ppcValue = data[source].message.ppc;
            const ppvValue = data[source].message.ppv;

            if (ppcValue && ppvValue) {
                prices[source] = {
                    ppc: parseFloat(ppcValue.split(":")[1].trim()),
                    ppv: parseFloat(ppvValue.split(":")[1].trim())
                };
            }
        }
    }

    // Si no se encuentra la información esperada, puedes manejarlo según tus necesidades.
    if (Object.keys(prices).length === 0) {
        console.error('No se encontraron valores de precios en las fuentes especificadas.');
        return null;
    }
    return prices;
}


async function fetchDataAndDisplay() {
    try {
        // Definir las URLs de las API
        const apiUrls = [
            "https://test-gliv.onrender.com/ver_datos_dash",  // CriptoMarkert
            "https://test-gliv.onrender.com/ver_datos_dash",  // Buda
            "https://test-gliv.onrender.com/ver_datos_dash",  // Vita
            "https://test-gliv.onrender.com/ver_datos_dash",  // OrionX
            "https://test-gliv.onrender.com/ver_datos_dash",  // Binance
            "https://test-gliv.onrender.com/ver_datos_dash"   // OTC
        ];

        // Obtener los datos de todas las APIs al mismo tiempo
        const responses = await Promise.all(apiUrls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => response.json()));

        // Asignar los datos a variables
        const [dataCm, dataBuda, dataVita, dataOrion, dataBinance, dataOtc] = data;

        // Mostrar datos de CriptoMarkert
        document.querySelector("#data-cm-ppc").innerHTML = `${dataCm.cm.message.ppc}`;
        document.querySelector("#data-cm-ppv").innerHTML = `${dataCm.cm.message.ppv}`;

        // Mostrar datos de Buda
        document.querySelector("#data-buda-ppc").innerHTML = `${dataBuda.buda.message.ppc}`;
        document.querySelector("#data-buda-ppv").innerHTML = `${dataBuda.buda.message.ppv}`;

        // Mostrar datos de Vita
        document.querySelector("#data-vita-ppc").innerHTML = `${dataVita.vita.message.ppc}`;
        document.querySelector("#data-vita-ppv").innerHTML = `${dataVita.vita.message.ppv}`;

        // Mostrar datos de OrionX
        document.querySelector("#data-orion-ppc").innerHTML = `${dataOrion.orion.message.ppc}`;
        document.querySelector("#data-orion-ppv").innerHTML = `${dataOrion.orion.message.ppv}`;

        // Mostrar datos de OTC
        const dataOtcElement = document.querySelector("#data_otc");
        let budaOTCPrice = null;
        let orionOTCPrice = null;
        let kundaiOTCPrice = null;

        if ("otc" in dataOtc) {
            const otcMessageType = typeof dataOtc.otc.message;

            if (otcMessageType === "string") {
                // Si el mensaje es una cadena, asumimos que es un mensaje de error
                dataOtcElement.innerHTML = dataOtc.otc.message;
            } else if (otcMessageType === "object") {
                const otcMessage = dataOtc.otc.message;
                budaOTCPrice = otcMessage["Buda OTC"] || null;
                orionOTCPrice = otcMessage["Orion OTC"] || null;
                kundaiOTCPrice = otcMessage["Kundai OTC"] || null;

                // Si el mensaje es un objeto, asumimos que es un mensaje exitoso
                dataOtcElement.innerHTML = `
                    Buda OTC: ${budaOTCPrice || 'N/A'} <br />
                    Orion OTC: ${orionOTCPrice || 'N/A'} <br />
                    Kundai OTC: ${kundaiOTCPrice || 'N/A'}
                `;
            }
        } else {
            // Si no hay mensaje en la respuesta, mostrar un mensaje de error genérico
            dataOtcElement.innerHTML = "Error: No se pudo obtener la respuesta del servidor.";
        }

        // Mostrar datos de Binance
        document.querySelector("#data-binance-ppc").innerHTML = `${dataBinance.binance.message.ppc}`;
        document.querySelector("#data-binance-ppv").innerHTML = `${dataBinance.binance.message.ppv}`;

        //Mejor Precio
        const cmPrices = getPriceValues(dataCm);
        const budaPrices = getPriceValues(dataBuda);
        const vitaPrices = getPriceValues(dataVita);
        const orionPrices = getPriceValues(dataOrion);
        const binancePrices = getPriceValues(dataBinance);
        const cmPrice = cmPrices.cm.ppc;
        const budaPrice = budaPrices.buda.ppc;
        const vitaPrice = vitaPrices.vita.ppc;
        const orionPrice = orionPrices.orion.ppc;
        const binancePrice = binancePrices.binance.ppc;
        const cmPriceV = cmPrices.cm.ppv;
        const budaPriceV = budaPrices.buda.ppv;
        const vitaPriceV = vitaPrices.vita.ppv;
        const orionPriceV = orionPrices.orion.ppv;
        const binancePriceV = binancePrices.binance.ppv;

        const currentChileTime = new Date().toLocaleString("en-US", { timeZone: "America/Santiago" });
        const currentHour = new Date(currentChileTime).getHours();
        const currentDay = new Date(currentChileTime).getDay();
        let minPrice;

        if (currentDay >= 1 && currentDay <= 5 && currentHour > 9 && currentHour < 14) {
            // El día actual es de lunes a viernes y la hora está entre las 9 y las 14 horas
            minPrice = Math.min(
                cmPrice > 0 ? cmPrice : Infinity,
                budaPrice > 0 ? budaPrice : Infinity,
                vitaPrice > 0 ? vitaPrice : Infinity,
                orionPrice > 0 ? orionPrice : Infinity,
                binancePrice > 0 ? binancePrice : Infinity,
                budaOTCPrice > 0 ? budaOTCPrice : Infinity,
                orionOTCPrice > 0 ? orionOTCPrice : Infinity,
                kundaiOTCPrice > 0 ? kundaiOTCPrice : Infinity
            );
        } else {
            // En caso contrario
            minPrice = Math.min(
                cmPrice > 0 ? cmPrice : Infinity,
                budaPrice > 0 ? budaPrice : Infinity,
                vitaPrice > 0 ? vitaPrice : Infinity,
                orionPrice > 0 ? orionPrice : Infinity,
                binancePrice > 0 ? binancePrice : Infinity
            );
        }
        

        const maxPrice = Math.max(cmPriceV, budaPriceV, vitaPriceV, orionPriceV, binancePriceV);
        const sourceMinPrice = getSourceName(minPrice, cmPrice, budaPrice, vitaPrice, orionPrice, binancePrice, budaOTCPrice, orionOTCPrice, kundaiOTCPrice);
        const sourceMaxPrice = getSourceName(maxPrice, cmPriceV, budaPriceV, vitaPriceV, orionPriceV, binancePriceV);

       // Obtener el nombre del exchange de sourceMinPrice
        const minExchange = sourceMinPrice.exchange.toLowerCase();

        // Obtener la ruta de la imagen correspondiente del objeto exchangeLogos
        const minExchangeLogoUrl = exchangeLogos[minExchange];

        // Asignar la ruta de la imagen al atributo src de la etiqueta img
        document.getElementById("best_logo1").src = minExchangeLogoUrl;

        // Obtener el nombre del exchange de sourceMinPrice
        const maxExchange = sourceMaxPrice.exchange.toLowerCase();

        // Obtener la ruta de la imagen correspondiente del objeto exchangeLogos
        const maxExchangeLogoUrl = exchangeLogos[maxExchange];

        // Asignar la ruta de la imagen al atributo src de la etiqueta img
        document.getElementById("best_logo2").src = maxExchangeLogoUrl;
  

        document.getElementById("best_price1").innerHTML = minPrice;

        document.getElementById("best_name1").innerHTML = sourceMinPrice.exchange;

        document.getElementById("best_price2").innerHTML = maxPrice;

        document.getElementById("best_name2").innerHTML = sourceMaxPrice.exchange;


        var ctx = document.getElementById("nelson_grafico").getContext("2d");
        var myAreaChart;

        function createChart(dataCm, dataBuda, dataVita, dataOrion, dataBinance) {
            if (myAreaChart) {
                myAreaChart.destroy();
            }

            function generateLabels() {
                const labels = [];
                const currentMinute = new Date().getUTCMinutes();
                const currentBlockStart = currentMinute - (currentMinute % 5);
                const currentHour = new Date().getUTCHours() - 3; // Ajuste para la hora actual en Chile

                for (let i = 0; i < 300; i += 5) {
                    const hour = currentHour + Math.floor((currentBlockStart + i) / 60);
                    const minute = ((currentBlockStart + i) % 60).toString().padStart(2, "0");
                    labels.push(`${hour.toString().padStart(2, "0")}:${minute}`);
                }

                return labels;
            }

            // Generar los labels antes de crear el gráfico
            const labels = generateLabels();

            inicioCMppc = agregarDatosYReiniciar(inicioCMppc, extractValue(dataCm.cm.message.ppc), limite);
            inicioCMppv = agregarDatosYReiniciar(inicioCMppv, extractValue(dataCm.cm.message.ppv), limite);

            iniciobudappc = agregarDatosYReiniciar(iniciobudappc, extractValue(dataBuda.buda.message.ppc), limite);
            iniciobudappv = agregarDatosYReiniciar(iniciobudappv, extractValue(dataBuda.buda.message.ppv), limite);

            iniciovitappc = agregarDatosYReiniciar(iniciovitappc, extractValue(dataVita.vita.message.ppc), limite);
            iniciovitappv = agregarDatosYReiniciar(iniciovitappv, extractValue(dataVita.vita.message.ppv), limite);

            inicioorionppc = agregarDatosYReiniciar(inicioorionppc, extractValue(dataOrion.orion.message.ppc), limite);
            iniciorionppv = agregarDatosYReiniciar(iniciorionppv, extractValue(dataOrion.orion.message.ppv), limite);

            iniciobinanceppc = agregarDatosYReiniciar(iniciobinanceppc, extractValue(dataBinance.binance.message.ppc), limite);
            inicibinanceppv = agregarDatosYReiniciar(inicibinanceppv, extractValue(dataBinance.binance.message.ppv), limite);

            myAreaChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels, // Usar los labels generados
                    datasets: [
                        {
                            label: "CriptoMarket PPC",
                            data: inicioCMppc,
                            fill: false,
                            borderColor: "blue",
                            pointBackgroundColor: "green",
                            tension: 0.1,
                        },
                        {
                            label: "CriptoMarket PPV",
                            data: inicioCMppv,
                            fill: false,
                            borderColor: "blue",
                            pointBackgroundColor: "red",
                            tension: 0.1,
                        },
                        {
                            label: "Buda PPC",
                            data: iniciobudappc,
                            fill: false,
                            borderColor: "purple", // Azul claro para PPV
                            pointBackgroundColor: "green", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                        {
                            label: "Buda PPV",
                            data: iniciobudappv,
                            fill: false,
                            borderColor: "purple", // Azul claro para PPV
                            pointBackgroundColor: "red", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                        {
                            label: "Vita PPC",
                            data: iniciovitappc,
                            fill: false,
                            borderColor: "green", // Azul claro para PPV
                            pointBackgroundColor: "green", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                        {
                            label: "Vita PPV",
                            data: iniciovitappv,
                            fill: false,
                            borderColor: "green", // Azul claro para PPV
                            pointBackgroundColor: "red", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                        {
                            label: "OrionX PPC",
                            data: inicioorionppc,
                            fill: false,
                            borderColor: "lightblue", // Azul claro para PPV
                            pointBackgroundColor: "green", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                        {
                            label: "OrionX PPV",
                            data: iniciorionppv,
                            fill: false,
                            borderColor: "lightblue", // Azul claro para PPV
                            pointBackgroundColor: "red", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                        {
                            label: "Binance PPC",
                            data: iniciobinanceppc,
                            fill: false,
                            borderColor: "yellow", // Azul claro para PPV
                            pointBackgroundColor: "green", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                        {
                            label: "Binance PPV",
                            data: inicibinanceppv,
                            fill: false,
                            borderColor: "yellow", // Azul claro para PPV
                            pointBackgroundColor: "red", // Puntos rojos para PPV
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                callback: function (value, index, values) {
                                    return index * 5 + 'h';
                                },
                            },
                        },
                    },    
                },
            });
        }

        function updateChart(dataCm, dataBuda, dataVita, dataOrion, dataBinance) {
            myAreaChart.data.datasets[0].data = [extractValue(dataCm.cm.message.ppc), extractValue(dataBuda.buda.message.ppc), extractValue(dataVita.vita.message.ppc), extractValue(dataOrion.orion.message.ppc), extractValue(dataBinance.binance.message.ppc)];
            myAreaChart.data.datasets[1].data = [extractValue(dataCm.cm.message.ppv), extractValue(dataBuda.buda.message.ppv), extractValue(dataVita.vita.message.ppv), extractValue(dataOrion.orion.message.ppv), extractValue(dataBinance.binance.message.ppv)];
            myAreaChart.update();
        }

        function extractValue(data) {
            const match = data.match(/\d+\.\d+/);
            return match ? parseFloat(match[0]) : NaN;
        }

        createChart(dataCm, dataBuda, dataVita, dataOrion, dataBinance);

        setInterval(async function () {
            updateChart(dataCm, dataBuda, dataVita, dataOrion, dataBinance);
            try {
                // Actualizar datos de Buda, Vita y Orion
            } catch (error) {
                console.error("Error fetching or updating data:", error);
            }
        }, 50000);

    } catch (error) {
        console.error("Error fetching or displaying data:", error);
    }
}

async function fetchDataAndDisplayIfInSpecificRoute() {
    // Obtener la ruta actual del navegador
    const currentPath = window.location.pathname;

    // Verificar si estás en la ruta específica donde deseas realizar solicitudes
    if (currentPath === '/dash/') {
        // Llamar a fetchDataAndDisplay inicialmente
        await fetchDataAndDisplay();

        // Establecer un intervalo para ejecutar fetchDataAndDisplay cada 60 segundos
        intervalId = setInterval(async () => {
            await fetchDataAndDisplay();
        }, 60000); // 60000 milisegundos = 60 segundos
    } else {
        // Detener el intervalo si no estás en la ruta específica
        stopInterval();
    }
}

// Llamar a fetchDataAndDisplayIfInSpecificRoute inicialmente
fetchDataAndDisplayIfInSpecificRoute();

// Agregar un evento para verificar la ruta antes de realizar solicitudes
window.addEventListener('hashchange', fetchDataAndDisplayIfInSpecificRoute);

