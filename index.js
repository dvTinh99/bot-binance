const ccxt = require('ccxt');
const moment = require('moment');
const env = require('dotenv');
env.config();
// const delay = require('delay');

console.log('process.env.API_KEY', process.env.API_KEY);
const API_KEY = process.env.API_KEY || 'dTMgs7iTSPx9TqtJr83jtm24PeRizv6Yr8N3IjIvGsN6qnyPzApmjB4RlLkqW4Ba';
const SECRET_KEY = process.env.SECRET_KEY || 'zPHxZEGLmV4bHJuEvDv61Ie26nndINHP5OxLcM9M5vcFbdLBoo053muhnCPl9k1G';


var buyed = false;
var initClose = 0;
var totalBuyed = 0;
const COIN_TRADE = 'REZ/USDT';
const USDT_TRADE = 20;
var count = 0;

async function printBalance(binance) {
    
    let target = COIN_TRADE.split('/')[0];
    const balance = await binance.fetchBalance();
    const coins = balance['info']['balances'];
    const USDT = coins.find( e => e.asset == 'USDT');
    const coinTarget = coins.find( e => e.asset == target);
    console.log('USDT', USDT);
    console.log('coinTarget', coinTarget);
    
}

async function tick() {
    try {
        let binance = new ccxt.binance({
            apiKey : 'iPy7Ss2VkBuC2LlqGr25dTZTNt4PPCfehXA7B1EfX7AoKhEHtNzPmGaAzYoBY0FA',
            secret : '4fRmmAZfFhN0W0suXEWQydeXIuOk5J2QmbziyrO1ntq8ROHdZJsxTG8ebVhnsohq',
        });
        count += 1;
        // load market không work
        // await binance.loadMarkets();
        
        if (!buyed) {
            // that mean buy with 20$
            let exampleTotalAmount = 2;
            let exampleTotalProce = USDT_TRADE / exampleTotalAmount;
            const order = await binance.createOrder(COIN_TRADE, 'market', 'buy', exampleTotalAmount, exampleTotalProce)
			buyed = true;
			console.log('tốn usdt :', order.cost);
			console.log('mua được :', order.amount);
			console.log('ở giá:', order.price);
			totalBuyed = order.amount;
			initClose = order.price;
			printBalance(binance);
        }

		const load = await binance.fetchTicker(COIN_TRADE);
		var close = load.close; 

        if (close / initClose > 2) {
            console.log({
                close : close,
            });
            const order = await binance.createOrder(COIN_TRADE, 'market', 'sell', totalBuyed)
            console.log('đã bán:', order.amount);
            console.log('ở giá :', order.price);
            console.log('thu được usdt :', order.cost);
        }
        console.log('close' + moment().format(), close);
        
    } catch (error) {
        console.log('error catch ne' + moment().format(), error);
        
    }
    return ;
}
async function main() {
    
    // tick();
    // binance.setSandboxMode(true);
    while (true) {
        
        await tick();
    }
    // setInterval(tick, 100);

    // printBalance(binance);
    

}

// main()

async function fetchPrice() {
    let binance = new ccxt.binance({
        apiKey : 'iPy7Ss2VkBuC2LlqGr25dTZTNt4PPCfehXA7B1EfX7AoKhEHtNzPmGaAzYoBY0FA',
        secret : '4fRmmAZfFhN0W0suXEWQydeXIuOk5J2QmbziyrO1ntq8ROHdZJsxTG8ebVhnsohq',
    });
    // load market không work
    // await binance.loadMarkets();
    
    let data = await binance.fetchOHLCV(COIN_TRADE, '1s', 1714478400000, 10);
    data = data.map(item => {
        return {
            raw : item[0],
            timestamp : moment(item[0]).format(),
            open : item[1],
            height : item[2],
            low : item[3],
            close : item[4],
            volume : item[5],
        }
    });

    console.log('data', data);
    
}
fetchPrice();