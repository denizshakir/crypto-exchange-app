import api from './api';

import {
  TBinanceCandlesResponse,
  TBitfinexCandlesResponse,
  THuobiCandlesResponse,
  TKrakenCandlesResponse,
} from '@/types/candles';
import {
  BINANCE_API_URL,
  BITFINEX_API_URL,
  HUOBI_API_URL,
  KRAKEN_API_URL,
} from '@/constants/urls';

const LIMIT = 100;
const INTERVAL = 15;

export const fetchBinanceCandles = async ({
  symbolId,
}: {
  symbolId: string;
}) => {
  const url = `${BINANCE_API_URL}/api/v3/uiKlines?symbol=${symbolId}&interval=${INTERVAL}m`;
  return api.get<TBinanceCandlesResponse>(url);
};

export const fetchKrakenCandles = async ({
  symbolId,
}: {
  symbolId: string;
}) => {
  const url = `${KRAKEN_API_URL}/0/public/OHLC?pair=${symbolId}&interval=${INTERVAL}`;
  return api.get<TKrakenCandlesResponse>(url);
};

export const fetchBitfinexCandles = async ({
  symbolId,
}: {
  symbolId: string;
}) => {
  const candle = `trade:${INTERVAL}m:t${symbolId}/hist`;
  const url = `/api/bitfinex/v2/candles/${candle}`;
  return api.get<TBitfinexCandlesResponse>(url);
};

export const fetchHuobiCandles = async ({ symbolId }: { symbolId: string }) => {
  const url = `${HUOBI_API_URL}/market/history/kline?symbol=${symbolId}&period=${INTERVAL}min&size=${LIMIT}`;
  return api.get<THuobiCandlesResponse>(url);
};
