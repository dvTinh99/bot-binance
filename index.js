const ccxt = require('ccxt');
const moment = require('moment');
const env = require('dotenv');
env.config();
// const delay = require('delay');

console.log('process.env.API_KEY', process.env.API_KEY);
const API_KEY = process.env.API_KEY || 'dTMgs7iTSPx9TqtJr83jtm24PeRizv6Yr8N3IjIvGsN6qnyPzApmjB4RlLkqW4Ba';
const SECRET_KEY = process.env.SECRET_KEY || 'zPHxZEGLmV4bHJuEvDv61Ie26nndINHP5OxLcM9M5vcFbdLBoo053muhnCPl9k1G';
const binance = new ccxt.binance({
    apiKey : API_KEY,
    secret : SECRET_KEY,
});

var buyed = false;
var initOpen = 0;
var totalBuyed = 0;
const COIN_TRADE =  'ALGO/USDT';
const USDT_TRADE = 30;
const MAX = 2;

var count = 0;

// binance.setSandboxMode(true);

async function printBalance() {
    
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
        count += 1;
        // await binance.loadMarkets();

        // const W = binance.market(COIN_TRADE);
        const load = await binance.fetchTicker(COIN_TRADE);
        
        if (load.open > 0) {
            // const prices = await binance.fetchOHLCV(COIN_TRADE, '1s', undefined, 1);
            let open = load.open;
            if (!buyed) {
                console.log({
                    open : open,
                });
                initOpen = open;
                
                if (open < MAX) {
                    buyed = true;
    
                    totalBuyed = USDT_TRADE / open;
                    const order = await binance.createLimitBuyOrder(COIN_TRADE, totalBuyed, open + 0.05)
                    console.log('tốn usdt :', order.cost);
                    console.log('mua được :', order.amount);
                    console.log('ở giá:', order.price);
                }
    
                printBalance();
    
            }
            if (open / initOpen > 5) {
                console.log({
                    open : open,
                });
                const order = await binance.createLimitSellOrder(COIN_TRADE, totalBuyed, open);
                console.log('đã bán x5:', order.amount);
                console.log('ở giá :', order.price);
            } else if(open / initOpen > 3) {
                console.log({
                    open : open,
                });
                const order = await binance.createLimitSellOrder(COIN_TRADE, totalBuyed, open);
                console.log('đã bán x3:', order.amount);
                console.log('ở giá :', order.price);
            }
        }
    } catch (error) {
        console.log('error catch ne' + count, error);
        
    }
}
async function main() {
    
    // tick();
    setInterval(tick, 100);
    

}

main()