import { useCallback, useEffect, useRef } from 'react';

import { EExchange } from '@/types/marketData';
import {
  removeAsk,
  removeBid,
  syncAsks,
  syncBids,
  setIsDataLoaded,
  setIsLoading,
  setAsks,
  setBids,
  setHasError,
} from '@/slices/ordersSlice';
import { subscribeBinanceOrders } from '@/utils/binanceHelper';
import { subscribeKrakenOrders } from '@/utils/krakenHelper';
import { subscribeBitfinexOrders } from '@/utils/bitfinexHelper';
import { subscribeHuobiOrders } from '@/utils/huobiHelper';
import useWithDispatch from '@/hooks/useWithDispatch';

type TUseOrdersParams = {
  exchange: EExchange;
  pair: string;
};

const useOrders = ({ exchange, pair }: TUseOrdersParams) => {
  const onSetAsks = useWithDispatch(setAsks);
  const onSetBids = useWithDispatch(setBids);
  const onAsksSync = useWithDispatch(syncAsks);
  const onBidsSync = useWithDispatch(syncBids);
  const onRemoveAsk = useWithDispatch(removeAsk);
  const onRemoveBid = useWithDispatch(removeBid);
  const onSetIsDataLoaded = useWithDispatch(setIsDataLoaded);
  const onSetHasError = useWithDispatch(setHasError);
  const onSetIsLoading = useWithDispatch(setIsLoading);

  const socketRef = useRef<WebSocket>();
  const subscribedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onError = useCallback(() => {
    onSetHasError(true);
    onSetIsLoading(false);
  }, [onSetHasError, onSetIsLoading]);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const handlers = {
      [EExchange.BINANCE]: subscribeBinanceOrders,
      [EExchange.KRAKEN]: subscribeKrakenOrders,
      [EExchange.BITFINEX]: subscribeBitfinexOrders,
      [EExchange.HUOBI]: subscribeHuobiOrders,
    };

    const handler = handlers[exchange];

    const { url, onMessage, onOpen } = handler({
      pair,
      setAsks: onSetAsks,
      setBids: onSetBids,
      syncAsks: onAsksSync,
      syncBids: onBidsSync,
      removeAsk: onRemoveAsk,
      removeBid: onRemoveBid,
      setHasError: onSetHasError,
      setIsDataLoaded: onSetIsDataLoaded,
      setIsLoading: onSetIsLoading,
    });

    const socket = new WebSocket(url);
    socketRef.current = socket;
    timeoutRef.current = setTimeout(() => {
      onError();
    }, 1000 * 10);
    onSetIsLoading(true);

    socket.addEventListener('open', () => {
      console.log(`${exchange} orders socket opened`);
      subscribedRef.current = true;
      onOpen(socket);
    });

    socket.addEventListener('message', async (e) => {
      clearTimeoutRef();
      onMessage(e, socket);
    });

    socket.addEventListener('close', () => {
      console.log(`${exchange} orders socket closed`);
    });

    socket.addEventListener('error', (error) => {
      onError();
      console.error(`${exchange} orders socket error: `, error);
    });

    return () => {
      setIsLoading(true);
      onSetAsks([]);
      onSetBids([]);
      onSetHasError(false);
      subscribedRef.current = false;
      socketRef.current?.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    clearTimeoutRef,
    exchange,
    onAsksSync,
    onSetAsks,
    onBidsSync,
    onError,
    onSetBids,
    onSetHasError,
    onSetIsDataLoaded,
    onRemoveAsk,
    onRemoveBid,
    onSetIsLoading,
    pair,
  ]);
};

export default useOrders;
