import { FC, memo, useMemo } from 'react';
import { Card } from '@heroui/card';

import ErrorState from '@/components/ErrorState/ErrorState';
import MarketDataPanel from '@/components/MarketDataPanel/MarketDataPanel';
import { EExchange, IMarketDataPanelItem } from '@/types/marketData';
import { IOrderItem } from '@/types/orders';
import useAppSelector from '@/hooks/useAppSelector';
import useOrders from '@/hooks/useOrders';

const mapOrderToMarketDataPanelItem = (item: IOrderItem) => ({
  amount: item.quantity,
  price: item.price,
});

interface IOrdersSectionProps {
  exchange: EExchange;
  isLoading: boolean;
  pair: string;
}

const OrdersSection: FC<IOrdersSectionProps> = (props) => {
  const { exchange, isLoading, pair } = props;

  const orders = useAppSelector((store) => store.orders.data);
  const hasError = useAppSelector((store) => store.orders.hasError);

  const asks = useMemo<IMarketDataPanelItem[]>(() => {
    return orders.asks.map(mapOrderToMarketDataPanelItem);
  }, [orders.asks]);

  const bids = useMemo<IMarketDataPanelItem[]>(() => {
    return orders.bids.map(mapOrderToMarketDataPanelItem);
  }, [orders.bids]);

  const errorMessage = useMemo(
    () => `Unable to load order book data for ${pair} on ${exchange}.`,
    [exchange, pair],
  );

  const emptyContent = useMemo(() => {
    const message = hasError ? errorMessage : '';

    return <p className="break-normal break-words max-w-80">{message}</p>;
  }, [errorMessage, hasError]);

  useOrders({ exchange, pair });

  return (
    <Card className="flex p-4 flex-col gap-3 min-w-sm" id="orders-section">
      <h3 className="text-lg font-semibold">Order book</h3>
      <div className="flex flex-row xl:flex-col 2xl:flex-col gap-3">
        {!hasError ? (
          <>
            <MarketDataPanel
              data={asks}
              isLoading={isLoading}
              priceColor="red"
              ticker={pair}
            />
            <MarketDataPanel
              data={bids}
              isLoading={isLoading}
              priceColor="green"
              ticker={pair}
            />
          </>
        ) : (
          <ErrorState>{emptyContent}</ErrorState>
        )}
      </div>
    </Card>
  );
};

export default memo(OrdersSection);
