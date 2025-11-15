const isDevENv = import.meta.env.MODE === 'development';

export const BINANCE_API_URL = isDevENv
  ? '/binance'
  : 'https://api.binance.com';
export const KRAKEN_API_URL = isDevENv ? '/kraken' : 'https://api.kraken.com';
export const BITFINEX_API_URL = isDevENv
  ? '/bitfinex'
  : 'https://api-pub.bitfinex.com';
export const HUOBI_API_URL = isDevENv ? '/huobi' : 'https://api.huobi.pro';
