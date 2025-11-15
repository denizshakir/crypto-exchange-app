import { ungzip } from 'pako';

import { extractSymbolId } from './symbolHelper';

import {
  IOrderItem,
  THuobiPayload,
  THuobiPayloadAskBid,
  TSubcribeOrdersBase,
} from '@/types/orders';

type TUseHuobiOrdersParams = TSubcribeOrdersBase;

export const subscribeHuobiOrders = ({
  pair,
  setAsks,
  setBids,
  setHasError,
  setIsLoading,
}: TUseHuobiOrdersParams) => {
  const url = 'wss://api.huobi.pro/ws';

  const onOpen = (ws: WebSocket) => {
    const symbol = extractSymbolId(pair).toLowerCase();
    const data = JSON.stringify({
      sub: `market.${symbol}.mbp.refresh.10`,
      id: 'id1',
    });

    ws.send(data);
  };

  const onMessage = async (e: MessageEvent<any>, ws: WebSocket) => {
    const arrayBuffer = await e.data.arrayBuffer();
    const some = ungzip(new Uint8Array(await arrayBuffer), {
      to: 'string',
    });

    const payload: THuobiPayload = JSON.parse(some);

    if ('status' in payload && payload.status === 'error') {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    if ('ping' in payload) {
      const data = JSON.stringify({
        pong: payload.ping,
      });
      ws.send(data);
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

    const newAsks = payload.tick.asks.slice(0, 10).map(ordersMap);
    const newBids = payload.tick.bids.slice(0, 10).map(ordersMap);

    setAsks(newAsks);
    setBids(newBids);
    setIsLoading(false);
  };

  return {
    onOpen,
    onMessage,
    url,
  };
};
