import api from './api';

import {
  TBinanceCandlesResponse,
  TBitfinexCandlesResponse,
  THuobiCandlesResponse,
  TKrakenCandlesResponse,
} from '@/types/candles';

const LIMIT = 100;
const INTERVAL = 15;

export const fetchBinanceCandles = async ({
  symbolId,
}: {
  symbolId: string;
}) => {
  const url = `/binance/api/v3/uiKlines?symbol=${symbolId}&interval=${INTERVAL}m`;
  return api.get<TBinanceCandlesResponse>(url);
};

export const fetchKrakenCandles = async ({
  symbolId,
}: {
  symbolId: string;
}) => {
  const url = `/kraken/0/public/OHLC?pair=${symbolId}&interval=${INTERVAL}`;
  return api.get<TKrakenCandlesResponse>(url);
};

export const fetchBitfinexCandles = async ({
  symbolId,
}: {
  symbolId: string;
}) => {
  const candle = `trade:${INTERVAL}m:t${symbolId}/hist`;
  const url = `/bitfinex/v2/candles/${candle}`;
  return api.get<TBitfinexCandlesResponse>(url);
};

export const fetchHuobiCandles = async ({ symbolId }: { symbolId: string }) => {
  const url = `/huobi/market/history/kline?symbol=${symbolId}&period=${INTERVAL}min&size=${LIMIT}`;
  return api.get<THuobiCandlesResponse>(url);
};
