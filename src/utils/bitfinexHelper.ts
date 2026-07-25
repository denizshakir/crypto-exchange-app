import { throttle } from 'lodash';

import { extractSymbolId } from './symbolHelper';

import {
  IOrderItem,
  TBitfinexPayload,
  TBitfinexPayloadOrder,
  TSubcribeOrdersBase,
} from '@/types/orders';
import { ORDERS_THROTTLE_MS } from '@/constants/orders';

export const subscribeBitfinexOrders = ({
  pair,
  syncAsks,
  syncBids,
  setHasError,
  setIsLoading,
  onSend,
}: TSubcribeOrdersBase) => {
  const url = 'wss://api-pub.bitfinex.com/ws/2';

  const askMap = new Map<string, IOrderItem>();
  const bidMap = new Map<string, IOrderItem>();

  const onOpen = () => {
    const symbol = extractSymbolId(pair).toUpperCase();
    const data = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol,
      frequency: 'F0',
      prec: 'P0',
      len: 25,
    });

    onSend(data);
  };

  const flush = throttle(() => {
    syncAsks([...askMap.values()]);
    syncBids([...bidMap.values()]);
    askMap.clear();
    bidMap.clear();
  }, ORDERS_THROTTLE_MS);

  const onMessage = (e: MessageEvent<any>) => {
    const data: TBitfinexPayload = JSON.parse(e.data);
    if ('event' in data && data.event === 'error') {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    if (!Array.isArray(data) || data[1] === 'hb') return;

    setIsLoading(false);
    const secondItem = data[1];
    if (Array.isArray(secondItem[0])) {
      (secondItem as TBitfinexPayloadOrder[]).forEach((item) => {
        const price = item[0];
        const amount = item[2];
        const order: IOrderItem = { price, quantity: Math.abs(amount) };
        if (amount > 0) {
          bidMap.set(price.toString(), order);
        } else {
          askMap.set(price.toString(), order);
        }
      });

      flush();
      return;
    }

    const [price, count, amount] = secondItem as TBitfinexPayloadOrder;

    const order: IOrderItem = { price, quantity: Math.abs(amount) };
    if (count === 0) {
      if (amount > 0) {
        bidMap.set(price.toString(), { ...order, quantity: 0 });
      } else {
        askMap.set(price.toString(), { ...order, quantity: 0 });
      }
      flush();
      return;
    }

    amount > 0
      ? bidMap.set(price.toString(), order)
      : askMap.set(price.toString(), order);
    flush();
  };

  return {
    onOpen,
    onMessage,
    url,
  };
};
