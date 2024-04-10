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
const MAX = 5;

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
    let binance = new ccxt.binance({
        apiKey : API_KEY,
        secret : SECRET_KEY,
    });
    binance.setSandboxMode(true);
    try {
        count += 1;
        // await binance.loadMarkets();

        // const W = binance.market(COIN_TRADE);
        const load = await binance.fetchTicker(COIN_TRADE);
        
        let close = load.close; 
        console.log('close', close);
        if (!buyed) {
            console.log({
                close : close,
            });
            initClose = close;
            
            if (close < MAX) {
                buyed = true;

                totalBuyed = USDT_TRADE / close;
                console.log('totalBuyed', totalBuyed);
                console.log('USDT_TRADE', USDT_TRADE);
                console.log('close', close);
                
                const order = await binance.createOrder(COIN_TRADE, 'market', 'buy', totalBuyed, close)
                
                console.log('order', order);
                
                console.log('tốn usdt :', order.cost);
                console.log('mua được :', order.amount);
                console.log('ở giá:', order.price);
                totalBuyed = order.amount;
                initClose = order.price;
                printBalance(binance);
            }

            
        }

        if (close / initClose > 5) {
            console.log({
                close : close,
            });
            const order = await binance.createOrder(COIN_TRADE, 'market', 'sell', totalBuyed)
            console.log('đã bán:', order.amount);
            console.log('ở giá :', order.price);
            console.log('thu được usdt :', order.cost);
        } else if(close / initClose > 3) {
            console.log({
                close : close,
            });
            const order = await binance.createOrder(COIN_TRADE, 'market', 'sell', totalBuyed)
            console.log('đã bán:', order.amount);
            console.log('ở giá :', order.price);
            console.log('thu được usdt :', order.cost);
        }
        
    } catch (error) {
        console.log('error catch ne' + count, error);
        
    }
    return ;
}
async function main() {
    
    // tick();
    setInterval(tick, 100);
    

}

main()