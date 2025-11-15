import api from './api';

import {
  TBinanceTickerResponse,
  TBitfinexTickerResponse,
  THuobiTickerResponse,
  TKrakenTickerResponse,
} from '@/types/marketData';

export const fetchKrakenTicker = async (ticker: string) => {
  const url = `kraken/0/public/Ticker?pair=${ticker}`;
  return api.get<TKrakenTickerResponse>(url);
};

export const fetchBinanceTicker = async (ticker: string) => {
  const url = `/binance/api/v3/ticker/24hr?symbol=${ticker}`;
  return api.get<TBinanceTickerResponse>(url);
};

export const fetchHuobiTicker = async (ticker: string) => {
  const url = `/huobi/market/detail/merged?symbol=${ticker}`;
  return api.get<THuobiTickerResponse>(url);
};

export const fetchBitfinexTicker = async (ticker: string) => {
  const url = `/bitfinex/v2/ticker/t${ticker}`;
  return api.get<TBitfinexTickerResponse>(url);
};
