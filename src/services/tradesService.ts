import api from './api';

import {
  TBinanceTradesResponse,
  TBitfinexTradesResponse,
  TFetchBinanceTradesParams,
  TFetchBitfinexTradesParams,
  TFetchHuobiTradesParams,
  TFetchKrakenTradesParams,
  THuobiTradesResponse,
  TKrakenTradesResponse,
} from '@/types/trades';

const DEFAULT_SIZE = 10;

export const fetchBinanceTrades = async ({
  symbolId,
  limit = DEFAULT_SIZE,
}: TFetchBinanceTradesParams) => {
  const url = `/binance/api/v3/trades?symbol=${symbolId}&limit=${limit}`;
  return api.get<TBinanceTradesResponse>(url);
};

export const fetchHuobiTrades = async ({
  symbolId,
  size = DEFAULT_SIZE,
}: TFetchHuobiTradesParams) => {
  const url = `/huobi/market/history/trade?symbol=${symbolId}&size=${size}`;
  return api.get<THuobiTradesResponse>(url);
};

export const fetchBitfinexTrades = async ({
  symbolId,
  limit = DEFAULT_SIZE,
}: TFetchBitfinexTradesParams) => {
  const url = `/bitfinex/v2/trades/t${symbolId}/hist?limit=${limit}`;
  return api.get<TBitfinexTradesResponse>(url);
};

export const fetchKrakenTrades = async ({
  count = DEFAULT_SIZE,
  symbolId,
}: TFetchKrakenTradesParams) => {
  const url = `/kraken/0/public/Trades?pair=${symbolId}&count=${count}`;
  return api.get<TKrakenTradesResponse>(url);
};
