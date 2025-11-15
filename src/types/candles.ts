export type TBinanceCandlesResponse = [
  number, // candle opening time
  string, // open price
  string, // high price
  string, // low price
  string, // close price
  string, // volume
  number, // candle close time
  string, // qoute asset volume
  number, // number of trades
  string, // taker buy base asset volume
  string, // taker buy quote asset volume
  string, // unused field.
][];

export type TKrakenCandlesResponse = {
  error: any[];
  result: {
    last: number;
    [ticker: string]:
      | [
          number, // unix timestamp
          string, // open
          string, // high
          string, // low
          string, // close
          string, // vwap
          string, // volume
          number, // count
        ][]
      | number;
  };
};

export type TBitfinexCandlesResponse = [
  number, // milliseconds
  number, // open
  number, // close
  number, // high
  number, // low
  number, // volume
][];

export type THuobiCandlesResponse = {
  ch: string;
  status: string;
  ts: number; // unix timestamp
  data: {
    id: number;
    open: number;
    close: number;
    low: number;
    high: number;
    amount: number;
    vol: number;
    count: number;
  }[];
};

export interface ICandleStick {
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
  ms: string;
}
