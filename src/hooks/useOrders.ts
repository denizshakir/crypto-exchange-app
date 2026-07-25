import { useCallback, useEffect, useMemo, useRef } from 'react';

import { EExchange } from '@/types/marketData';
import {
  syncAsks,
  syncBids,
  setIsLoading,
  setAsks,
  setBids,
  setHasError,
} from '@/slices/ordersSlice';
import { subscribeBinanceOrders } from '@/utils/binanceHelper';
import useWithDispatch from '@/hooks/useWithDispatch';
import { subscribeKrakenOrders } from '@/utils/krakenHelper';
import { subscribeBitfinexOrders } from '@/utils/bitfinexHelper';
import { subscribeHuobiOrders } from '@/utils/huobiHelper';

const CONNECTION_TIMEOUT_MS = 1000 * 10;

type TUseOrdersParams = {
  exchange: EExchange;
  pair: string;
};

const useOrders = ({ exchange, pair }: TUseOrdersParams) => {
  const onSetAsks = useWithDispatch(setAsks);
  const onSetBids = useWithDispatch(setBids);
  const onAsksSync = useWithDispatch(syncAsks);
  const onBidsSync = useWithDispatch(syncBids);
  const onSetHasError = useWithDispatch(setHasError);
  const onSetIsLoading = useWithDispatch(setIsLoading);

  const socketRef = useRef<WebSocket>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onError = useCallback(() => {
    onSetHasError(true);
    onSetIsLoading(false);
  }, [onSetHasError, onSetIsLoading]);

  const onSend = useCallback((data: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(data);
    }
  }, []);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handler = useMemo(() => {
    const handlers = {
      [EExchange.BINANCE]: subscribeBinanceOrders,
      [EExchange.KRAKEN]: subscribeKrakenOrders,
      [EExchange.BITFINEX]: subscribeBitfinexOrders,
      [EExchange.HUOBI]: subscribeHuobiOrders,
    };

    return handlers[exchange];
  }, [exchange]);

  useEffect(() => {
    let isStale = false;

    const { url, onMessage, onOpen } = handler({
      pair,
      setAsks: onSetAsks,
      setBids: onSetBids,
      syncAsks: onAsksSync,
      syncBids: onBidsSync,
      setHasError: onSetHasError,
      setIsLoading: onSetIsLoading,
      onSend,
    });

    const socket = new WebSocket(url);
    socketRef.current = socket;
    timeoutRef.current = setTimeout(onError, CONNECTION_TIMEOUT_MS);
    onSetIsLoading(true);

    const handleOpen = () => {
      console.log(`${exchange} orders socket opened`);
      onOpen();
    };

    const handleMessage = (e: MessageEvent<any>) => {
      if (isStale) return;
      clearTimeoutRef();
      onMessage(e);
    };

    const handleClose = () => {
      console.log(`${exchange} orders socket closed`);
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', handleClose);
    socket.addEventListener('error', onError);

    return () => {
      isStale = true;
      socket.removeEventListener('message', handleMessage);
      onSetIsLoading(true);
      onSetAsks([]);
      onSetBids([]);
      onSetHasError(false);
      socketRef.current?.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    clearTimeoutRef,
    exchange,
    handler,
    onAsksSync,
    onSetAsks,
    onBidsSync,
    onError,
    onSetBids,
    onSetHasError,
    onSend,
    onSetIsLoading,
    pair,
  ]);
};

export default useOrders;
