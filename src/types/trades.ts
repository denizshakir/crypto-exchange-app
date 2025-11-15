export type TBinanceTradesResponse = Array<{
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}>;

export type TKrakenTradesResponse = {
  error: any[];
  result: {
    last: string;
    [pair: string]:
      | [
          string, // price
          string, // volume
          number, // time
          'b' | 's', // buy/sell
          'm' | 'l', // market/limit
          string, // miscellaneous
          number, // tradeId
        ][]
      | string;
  };
};

export type TBitfinexTradesResponse = [
  number, // id
  number, // time in milliseconds
  number, // amount
  number, // price
][];

export type THuobiTradesResponse = {
  ch: string;
  status: string;
  ts: number;
  data: {
    id: number;
    ts: number;
    data: {
      id: number;
      ts: number;
      'trade-id': number;
      amount: number;
      price: number;
      direction: string;
    }[];
  }[];
};

export interface ITrade {
  amount: number;
  price: number;
}

type TFetchTradesBase = {
  symbolId: string;
};

export type TFetchBinanceTradesParams = TFetchTradesBase & {
  limit?: number;
};

export type TFetchHuobiTradesParams = TFetchTradesBase & {
  size?: number;
};

export type TFetchBitfinexTradesParams = TFetchTradesBase & {
  limit?: number;
};

export type TFetchKrakenTradesParams = TFetchTradesBase & {
  count?: number;
};
