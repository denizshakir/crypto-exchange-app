import api from './api';

import {
  TBinanceTickerResponse,
  TBitfinexTickerResponse,
  THuobiTickerResponse,
  TKrakenTickerResponse,
} from '@/types/marketData';
import {
  BINANCE_API_URL,
  BITFINEX_API_URL,
  HUOBI_API_URL,
  KRAKEN_API_URL,
} from '@/constants/urls';

export const fetchBinanceTicker = async (ticker: string) => {
  const url = `${BINANCE_API_URL}/api/v3/ticker/24hr?symbol=${ticker}`;
  return api.get<TBinanceTickerResponse>(url);
};

export const fetchKrakenTicker = async (ticker: string) => {
  const url = `${KRAKEN_API_URL}/0/public/Ticker?pair=${ticker}`;
  return api.get<TKrakenTickerResponse>(url);
};

export const fetchBitfinexTicker = async (ticker: string) => {
  const url = `${BITFINEX_API_URL}/v2/ticker/t${ticker}`;
  return api.get<TBitfinexTickerResponse>(url);
};

export const fetchHuobiTicker = async (ticker: string) => {
  const url = `${HUOBI_API_URL}/market/detail/merged?symbol=${ticker}`;
  return api.get<THuobiTickerResponse>(url);
};
