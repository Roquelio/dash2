const listData = async () => {
    try {
        const response = await fetch("https://test-gliv.onrender.com/ver_datos");
        const data = await response.json();

        ['usdt', 'btc', 'eth', 'bnb', 'dai', 'fdusd', 'doge', 'ada', 'xrp'].forEach((symbol) => {
            ['buy', 'sell'].forEach((tradeType) => {
                const symbolData = data[symbol];

                if (symbolData) {
                    symbolData[tradeType]?.forEach((ad, index) => {
                        updateTradeTypeData(data, symbol, tradeType, index);
                    });
                } else {
                    console.error(`Datos no válidos recibidos para ${symbol}:`, data);
                }
            });
        });
    } catch (ex) {
        console.error(ex);
    }
};

const updateTradeTypeData = (data, symbol, tradeType, index) => {
    const cell = $(`#${tradeType}-${symbol.toLowerCase()}-${index + 1}`);
    const ad = data[symbol]?.[tradeType]?.[index];

    if (!ad) {
        console.error(`Datos no válidos recibidos para ${tradeType} de ${symbol}:`, data);
        return;
    }

    cell.text(ad.TradeType === tradeType ? 'X' : '-');

    const formattedInfo = `
    ${ad.NickName} \n
    Precio: ${ad.Price} \n
    Cantidad: ${ad.TradableQuantity} \n
    Limite:${ad.minSingleTransAmount}-${ad.dynamicMaxSingleTransAmount}
    `;
    
    const infoCell = $(`#${tradeType}-${symbol.toLowerCase()}-${index + 1}`);
    infoCell.text(formattedInfo);
};

listData();

setInterval(listData, 2000);
