export enum EExchange {
  BINANCE = 'BINANCE',
  BITFINEX = 'BITFINEX',
  KRAKEN = 'KRAKEN',
  HUOBI = 'HUOBI',
}

export type TBinanceTickerResponse = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};

export type TKrakenTickerResponse = {
  error: string[];
  result: {
    [pair: string]: {
      a: [string, string, string]; // ask [price, whole lot volume, lot volume]
      b: [string, string, string]; // bid [price, whole lot volume, lot volume]
      c: [string, string]; // last trade closed [price, lot volume]
      v: [string, string]; // volume [today, last 24 hours]
      p: [string, string]; // volume-weighted average price [today, last 24 hours]
      t: [number, number]; // number of trades [today, last 24 hours]
      l: [string, string]; // low price [today, last 24 hours]
      h: [string, string]; // high price [today, last 24 hours]
      o: string; // opening price (today)
    };
  };
};

export type TBitfinexTickerResponse = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type THuobiTickerResponse = {
  ch: string;
  status: string;
  ts: number;
  tick: {
    id: number;
    version: number;
    open: number;
    close: number;
    low: number;
    high: number;
    amount: number;
    vol: number;
    count: number;
    bid: number[];
    ask: number[];
  };
};

export interface ITicker {
  ticker: string;
  lastTradePrice: string;
  openingPrice: string;
}

export interface IMarketDataItem {
  exchange: EExchange;
  openingPrice: string | null;
  ticker: string | null;
  lastTradePrice: string | null;
}

export interface TickerLiveData {
  ask: number;
  ask_qty: number;
  bid: number;
  bid_qty: number;
  change: number;
  change_pct: number;
  high: number;
  last: number;
  low: number;
  symbol: string;
  volume: number;
  vwap: number;
}

export interface IMarketDataPanelItem {
  amount: number;
  price: number;
}

export enum EMarketDataColumn {
  Exchange = 'Exchange',
  Asset = 'Asset',
  Change = 'Change',
  OpeningPrice = 'Opening price',
  Price = 'Price',
}
