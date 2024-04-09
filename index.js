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
const COIN_TRADE =  'WING/BTC';
const USDT_TRADE = 30;
const MAX = 2;

var count = 0;



// async function printBalance() {
    
//     let target = COIN_TRADE.split('/')[0];
//     const balance = await binance.fetchBalance();
//     const coins = balance['info']['balances'];
//     const USDT = coins.find( e => e.asset == 'USDT');
//     const coinTarget = coins.find( e => e.asset == target);
//     console.log('USDT', USDT);
//     console.log('coinTarget', coinTarget);
    
// }

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
        
        // console.log('load', load);
        let close = load.close; 
        if (!buyed) {
            console.log({
                close : close,
            });
            initClose = close;
            
            if (close < MAX) {
                buyed = true;

                totalBuyed = USDT_TRADE / close;
                // const order = await binance.createLimitBuyOrder(COIN_TRADE, totalBuyed, close + 0.05)
                console.log('tốn usdt :', order.cost);
                console.log('mua được :', order.amount);
                console.log('ở giá:', order.price);
            }

            // printBalance();

        }
        if (close / initClose > 5) {
            console.log({
                close : close,
            });
            // const order = await binance.createLimitSellOrder(COIN_TRADE, totalBuyed, close);
            console.log('đã bán x5:', order.amount);
            console.log('ở giá :', order.price);
        } else if(close / initClose > 3) {
            console.log({
                close : close,
            });
            // const order = await binance.createLimitSellOrder(COIN_TRADE, totalBuyed, close);
            console.log('đã bán x3:', order.amount);
            console.log('ở giá :', order.price);
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