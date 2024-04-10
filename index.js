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
const COIN_TRADE =  'ALGO/USDT';
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

async function tick(binance) {
    try {
        count += 1;
        await binance.loadMarkets();
        
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
    var binance = new ccxt.binance({
        apiKey : API_KEY,
        secret : SECRET_KEY,
    });
    binance.setSandboxMode(true);
    while (true) {
        await tick(binance);
    }
    // setInterval(tick, 100);
    

}

main()