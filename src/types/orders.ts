import { EExchange } from './marketData';

export type TBinanceOrdersResponse = {
  lastUpdateId: number;
  bids: [
    string, // price
    string, // qty
  ];
  asks: [string, string];
};

export interface IOrderItem {
  price: number;
  quantity: number;
}

export type TBinanceOrdersPayload = {
  asks: [string, string];
  bids: [string, string];
  lastUpdatedId: number;
};

type TKraneAskBid = {
  price: number;
  qty: number;
};

export type TKrakenOrdersPayload =
  | {
      channel: string;
      data: Array<{
        asks: Array<TKraneAskBid>;
        bids: Array<TKraneAskBid>;
        checksum: number;
        symbol: string;
        timestamp: string;
      }>;
      type: string;
    }
  | {
      error: string;
      method: string;
      success: false;
      symbol: string;
      time_in: string;
      time_out: string;
    };

export type TBitfinexPayloadOrder = [
  number, // price
  number, // count
  number, // amount
];

export type TBitfinexPayload =
  | [
      number, // channel id
      TBitfinexPayloadOrder | TBitfinexPayloadOrder[],
    ]
  | [
      number, // channel id
      'hb',
    ]
  | {
      event: 'info';
      platform: {
        status: number;
      };
      serverId: string;
      version: number;
    }
  | {
      chanId: number;
      channel: string;
      event: 'subscribed' | 'unsubscribed';
      symbol: string;
      freq?: string;
      len?: string;
      pair: string;
      prec?: string;
    }
  | {
      channel: string;
      code: number;
      event: 'error';
      len: number;
      msg: string;
      pair: string;
      prec: string;
      symbol: string;
    };

export type THuobiPayloadAskBid = [
  number, // price
  number, // amount
];

export type THuobiPayload =
  | { ping: number }
  | { id: string; status: string; subbed: string; ts: number }
  | {
      ch: string;
      ts: number;
      tick: {
        seqNum: number;
        bids: THuobiPayloadAskBid[];
        asks: THuobiPayloadAskBid[];
      };
    }
  | {
      'err-code': string;
      'err-msg': string;
      id: string;
      status: string;
      ts: number;
    };

export type TUseOrdersParams = {
  exchange: EExchange;
  pair: string;
};

export type TSubcribeOrdersBase = {
  pair: string;
  removeAsk: (ask: IOrderItem) => void;
  removeBid: (bid: IOrderItem) => void;
  setAsks: (asks: IOrderItem[]) => void;
  setBids: (bids: IOrderItem[]) => void;
  syncAsks: (asks: IOrderItem[]) => void;
  syncBids: (bids: IOrderItem[]) => void;
  setHasError: (hasError: boolean) => void;
  setIsDataLoaded: (isDataLoaded: boolean) => void;
  setIsLoading: (isTrueOrArray: boolean) => void;
};
