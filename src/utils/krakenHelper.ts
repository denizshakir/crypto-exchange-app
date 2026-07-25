import { throttle } from 'lodash';

import { extractSymbolId } from '@/utils/symbolHelper';
import {
  IOrderItem,
  TKrakenOrdersPayload,
  TSubcribeOrdersBase,
} from '@/types/orders';
import { ORDERS_SIZE, ORDERS_THROTTLE_MS } from '@/constants/orders';

export const subscribeKrakenOrders = ({
  pair,
  syncAsks,
  syncBids,
  setHasError,
  setIsLoading,
  onSend,
}: TSubcribeOrdersBase) => {
  const url = 'wss://ws.kraken.com/v2';

  const askMap = new Map<string, IOrderItem>();
  const bidMap = new Map<string, IOrderItem>();

  const flush = throttle(() => {
    syncAsks([...askMap.values()]);
    syncBids([...bidMap.values()]);
    askMap.clear();
    bidMap.clear();
  }, ORDERS_THROTTLE_MS);

  const onOpen = () => {
    const data = JSON.stringify({
      method: 'subscribe',
      params: {
        channel: 'book',
        depth: ORDERS_SIZE,
        symbol: [extractSymbolId(pair, '/')],
      },
    });
    onSend(data);
  };

  const onMessage = (e: MessageEvent<any>) => {
    const payload: TKrakenOrdersPayload = JSON.parse(e.data);
    if ('error' in payload) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    if ('channel' in payload && payload.channel !== 'book') return;

    if ('data' in payload) {
      payload.data[0].asks.forEach((ask) => {
        askMap.set(ask.price.toString(), {
          price: ask.price,
          quantity: ask.qty,
        });
      });
      payload.data[0].bids.forEach((bid) => {
        bidMap.set(bid.price.toString(), {
          price: bid.price,
          quantity: bid.qty,
        });
      });

      flush();
      setIsLoading(false);
    }
  };

  return {
    onOpen,
    onMessage,
    url,
  };
};
