import { ungzip } from 'pako';
import { throttle } from 'lodash';

import { extractSymbolId } from './symbolHelper';

import {
  IOrderItem,
  THuobiPayload,
  THuobiPayloadAskBid,
  TSubcribeOrdersBase,
} from '@/types/orders';
import { ORDERS_SIZE, ORDERS_THROTTLE_MS } from '@/constants/orders';

export const subscribeHuobiOrders = ({
  pair,
  setAsks,
  setBids,
  setHasError,
  setIsLoading,
  onSend,
}: TSubcribeOrdersBase) => {
  const url = 'wss://api.huobi.pro/ws';

  let latestAsks: IOrderItem[] = [];
  let latestBids: IOrderItem[] = [];

  const flush = throttle(() => {
    setAsks(latestAsks);
    setBids(latestBids);
  }, ORDERS_THROTTLE_MS);

  const onOpen = () => {
    const symbol = extractSymbolId(pair).toLowerCase();
    const data = JSON.stringify({
      sub: `market.${symbol}.mbp.refresh.${ORDERS_SIZE}`,
      id: 'id1',
    });

    onSend(data);
  };

  const onMessage = async (e: MessageEvent<any>) => {
    const arrayBuffer = await e.data.arrayBuffer();
    const bufferString = ungzip(new Uint8Array(await arrayBuffer), {
      to: 'string',
    });

    const payload: THuobiPayload = JSON.parse(bufferString);

    if ('status' in payload && payload.status === 'error') {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    if ('ping' in payload) {
      const data = JSON.stringify({
        pong: payload.ping,
      });
      onSend(data);
      return;
    }

    if ('id' in payload) return;

    const ordersMap = (item: THuobiPayloadAskBid) => {
      const newOrderItem: IOrderItem = {
        price: item[0],
        quantity: item[1],
      };
      return newOrderItem;
    };

    latestAsks = payload.tick.asks.map(ordersMap);
    latestBids = payload.tick.bids.map(ordersMap);
    flush();
    setIsLoading(false);
  };

  return {
    onOpen,
    onMessage,
    url,
  };
};
