const ccxt = require('ccxt');
const moment = require('moment');
const env = require('dotenv');
env.config();
// const delay = require('delay');

console.log('process.env.API_KEY', process.env.API_KEY);
const API_KEY = process.env.API_KEY || 'dTMgs7iTSPx9TqtJr83jtm24PeRizv6Yr8N3IjIvGsN6qnyPzApmjB4RlLkqW4Ba';
const SECRET_KEY = process.env.SECRET_KEY || 'zPHxZEGLmV4bHJuEvDv61Ie26nndINHP5OxLcM9M5vcFbdLBoo053muhnCPl9k1G';
const binance = new ccxt.binance({
    apiKey : process.env.API_KEY,
    secret : process.env.SECRET_KEY,
});

var buyed = false;
var initOpen = 0;
var totalBuyed = 0;
const COIN_TRADE =  'W/USDT';
const USDT_TRADE = 25;
const MAX = 1.1;

var count = 0;

binance.setSandboxMode(true);

async function printBalance() {
    
    const balance = await binance.fetchBalance();
    const coins = balance['info']['balances'];
    const USDT = coins.find( e => e.asset == 'USDT');
    const ALGO = coins.find( e => e.asset == 'ALGO');
    console.log('USDT', USDT);
    console.log('ALGO', ALGO);
    
}

async function getBalance(coin) {
    
    const balance = await binance.fetchBalance();
    const coins = balance['info']['balances'];
    const numberInBalance = coins.find( e => e.asset == 'coin');
    console.log('numberInBalance', numberInBalance);
    
}
async function tick() {
    try {
        count += 1;
        const prices = await binance.fetchOHLCV(COIN_TRADE, '1s', undefined, 1);
        let open = prices[0][1]
        let close = prices[0][4]
        let height = prices[0][2]

        
        
        if (!buyed) {
            console.log({
                open : open,
                close : close,
                height : height,
            });
            buyed = true;
            initOpen = open;

            totalBuyed = USDT_TRADE / open;


            const order = await binance.createLimitBuyOrder(COIN_TRADE, totalBuyed, open)
            console.log('tốn usdt :', order.cost);
            console.log('đổi được :', order.amount);
            console.log('ở giá:', order.price);

            printBalance();

            // console.log({
            //     open : open,
            //     close : close,
            //     height : height,
            // });
            // const orderSell = await binance.createLimitSellOrder(COIN_TRADE, totalBuyed, close);
            // console.log('đã bán :', orderSell.amount);
            // console.log('ở giá :', orderSell.price);

            // printBalance();

        }
        if (height == initOpen * 3) {
            console.log({
                open : open,
                close : close,
                height : height,
            });
            const order = await binance.createLimitSellOrder(COIN_TRADE, totalBuyed, open);
            console.log('đã bán :', order.amount);
            console.log('ở giá :', order.price);
        }
    } catch (error) {
        console.log('error catch ne' + count, error);
        
    }
}
async function main() {
    
    // tick();
    setInterval(tick, 500);
    

}

async function buySpotMarket(coin, cost) {
    // const balance = await binance.fetchBalance();
    // console.log('info', balance['info']);
    const order = await binance.createMarketBuyOrder(coin, cost)
    return order;
}
async function buySpotLimit(coin, cost) {
    // const balance = await binance.fetchBalance();
    // console.log('info', balance['info']);
    const order = await binance.createLimitBuyOrder(coin, cost, cost)
    return order;
}

main()
// printBalance();
// buySpotMarket('ALGO/USDT', 100)