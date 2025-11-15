import { extractSymbolId } from '@/utils/symbolHelper';
import {
  IOrderItem,
  TKrakenOrdersPayload,
  TSubcribeOrdersBase,
} from '@/types/orders';

type TUseKrakenOrdersParams = TSubcribeOrdersBase;

export const subscribeKrakenOrders = ({
  pair,
  syncAsks,
  syncBids,
  setHasError,
  setIsLoading,
}: TUseKrakenOrdersParams) => {
  const url = 'wss://ws.kraken.com/v2';

  const onOpen = (ws: WebSocket) => {
    const data = JSON.stringify({
      method: 'subscribe',
      params: {
        channel: 'book',
        depth: 10,
        symbol: [extractSymbolId(pair, '/')],
      },
    });
    ws.send(data);
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
      const asks: IOrderItem[] = payload.data[0].asks.map(({ price, qty }) => ({
        price,
        quantity: qty,
      }));
      const bids: IOrderItem[] = payload.data[0].bids.map(({ price, qty }) => ({
        price,
        quantity: qty,
      }));

      syncAsks(asks);
      syncBids(bids);
      setIsLoading(false);
    }
  };

  return {
    onOpen,
    onMessage,
    url,
  };
};
