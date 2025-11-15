const isDevENv = import.meta.env.MODE === 'development';

export const BINANCE_API_URL = isDevENv
  ? '/api/binance'
  : 'https://api.binance.com';
export const KRAKEN_API_URL = isDevENv
  ? '/api/kraken'
  : 'https://api.kraken.com';
export const BITFINEX_API_URL = isDevENv
  ? '/api/bitfinex'
  : 'https://api-pub.bitfinex.com';
export const HUOBI_API_URL = isDevENv ? '/api/huobi' : 'https://api.huobi.pro';
