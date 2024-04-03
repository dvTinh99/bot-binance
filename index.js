const ccxt = require('ccxt');
const moment = require('moment');
const env = require('dotenv');
env.config();
// const delay = require('delay');
console.log('process.env.API_KEY', process.env.API_KEY);

const binance = new ccxt.binance({
    apiKey : process.env.API_KEY,
    secret : process.env.SECRET_KEY,
});

var buyed = false;

// binance.setSandboxMode(true);

async function printBalance() {
    
    const balance = await binance.fetchBalance();
    const coins = balance['info']['balances'];
    const USDT = coins.find( e => e.asset == 'USDT');
    const ALGO = coins.find( e => e.asset == 'ALGO');
    console.log('info', balance['info']);
    console.log('USDT', USDT);
    
}
async function tick() {
    try {
        
        const prices = await binance.fetchOHLCV('W/USDT', '1s', undefined, 1);
        const bPrice = prices.map(price => {
            return {
                timestamp : moment(price[0]).format(),
                open : price[1],
                height : price[2],
                low : price[3],
                close : price[4],
                volume : price[5],
            }
        });

        console.log('bPrice', bPrice);
        

        if (!buyed) {
            buyed = true;

            const order = await binance.createLimitBuyOrder('W/USDT', 67, 0.3)
            console.log('tốn usdt :', order.cost);
            console.log('giá usdt đớp:', order.average);
            console.log('đổi được :', order.amount);

        }
    } catch (error) {
        console.log('error catch ne', error);
        
    }
}
async function main() {
    
    // tick();
    setInterval(tick, 1000);
    

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

// main()
printBalance();
// buySpotMarket('ALGO/USDT', 100)