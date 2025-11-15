import { extractSymbolId } from '@/utils/symbolHelper';
import {
  IOrderItem,
  TBinanceOrdersPayload,
  TSubcribeOrdersBase,
} from '@/types/orders';

type TUseBinanceOrdersParams = TSubcribeOrdersBase;

export const subscribeBinanceOrders = ({
  pair,
  setAsks,
  setBids,
  setIsLoading,
}: TUseBinanceOrdersParams) => {
  const onOpen = () => {};
  const extractedPair = extractSymbolId(pair);
  const url = `wss://stream.binance.com:9443/ws/${extractedPair.toLowerCase()}@depth10`;

  const onMessage = (event: MessageEvent<any>) => {
    const data: TBinanceOrdersPayload = JSON.parse(event.data);
    const asks: IOrderItem[] = data.asks.map(([price, qty]) => ({
      price: parseFloat(price),
      quantity: parseFloat(qty),
    }));
    const bids: IOrderItem[] = data.bids.map(([price, qty]) => ({
      price: parseFloat(price),
      quantity: parseFloat(qty),
    }));

    setAsks(asks);
    setBids(bids);
    setIsLoading(false);
  };

  return {
    onOpen,
    onMessage,
    url,
  };
};
