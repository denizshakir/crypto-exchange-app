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
import {
  BINANCE_API_URL,
  BITFINEX_API_URL,
  HUOBI_API_URL,
  KRAKEN_API_URL,
} from '@/constants/urls';

const DEFAULT_SIZE = 10;

export const fetchBinanceTrades = async ({
  symbolId,
  limit = DEFAULT_SIZE,
}: TFetchBinanceTradesParams) => {
  const url = `${BINANCE_API_URL}/api/v3/trades?symbol=${symbolId}&limit=${limit}`;
  return api.get<TBinanceTradesResponse>(url);
};

export const fetchKrakenTrades = async ({
  count = DEFAULT_SIZE,
  symbolId,
}: TFetchKrakenTradesParams) => {
  const url = `${KRAKEN_API_URL}/0/public/Trades?pair=${symbolId}&count=${count}`;
  return api.get<TKrakenTradesResponse>(url);
};

export const fetchBitfinexTrades = async ({
  symbolId,
  limit = DEFAULT_SIZE,
}: TFetchBitfinexTradesParams) => {
  const url = `${BITFINEX_API_URL}/v2/trades/t${symbolId}/hist?limit=${limit}`;
  return api.get<TBitfinexTradesResponse>(url);
};

export const fetchHuobiTrades = async ({
  symbolId,
  size = DEFAULT_SIZE,
}: TFetchHuobiTradesParams) => {
  const url = `${HUOBI_API_URL}/market/history/trade?symbol=${symbolId}&size=${size}`;
  return api.get<THuobiTradesResponse>(url);
};
