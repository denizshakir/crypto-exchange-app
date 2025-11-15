import { extractSymbolId } from './symbolHelper';

import {
  IOrderItem,
  TBitfinexPayload,
  TBitfinexPayloadOrder,
  TSubcribeOrdersBase,
} from '@/types/orders';

type TUseBitfinexOrdersParams = TSubcribeOrdersBase;

export const subscribeBitfinexOrders = ({
  pair,
  removeAsk,
  removeBid,
  syncAsks,
  syncBids,
  setHasError,
  setIsLoading,
}: TUseBitfinexOrdersParams) => {
  const url = 'wss://api-pub.bitfinex.com/ws/2';

  const onOpen = (ws: WebSocket) => {
    const symbol = extractSymbolId(pair).toUpperCase();
    const data = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol,
      frequency: 'F0',
      prec: 'P0',
      len: 25,
    });

    ws.send(data);
  };

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
      const newAsks: IOrderItem[] = [];
      const newBids: IOrderItem[] = [];

      (secondItem as TBitfinexPayloadOrder[]).forEach((item) => {
        const price = item[0];
        const amount = item[2];
        const order: IOrderItem = { price, quantity: Math.abs(amount) };
        amount > 0 ? newBids.push(order) : newAsks.push(order);
      });
      syncAsks(newAsks);
      syncBids(newBids);
      return;
    }

    const [price, count, amount] = secondItem as TBitfinexPayloadOrder;

    const order: IOrderItem = { price, quantity: Math.abs(amount) };
    if (count === 0) {
      amount > 0 ? removeBid(order) : removeAsk(order);
      return;
    }

    amount > 0 ? syncBids([order]) : syncAsks([order]);
  };

  return {
    onOpen,
    onMessage,
    url,
  };
};
