import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DefaultLayout from '@/layouts/Default';
import OrdersSection from '@/components/OrdersSection/OrdersSection';
import Chart from '@/components/Chart/Chart';
import Dropdown from '@/components/Dropdown/Dropdown';
import { EExchange } from '@/types/marketData';
import useAppSelector from '@/hooks/useAppSelector';
import useAppDispatch from '@/hooks/useAppDispatch';
import {
  getBinanceCandles,
  getBitfinexCandles,
  getHuobiCandles,
  getKrakenCandles,
} from '@/slices/candlesSlice';

const EXCHANGES: EExchange[] = [
  EExchange.BINANCE,
  EExchange.KRAKEN,
  EExchange.BITFINEX,
  EExchange.HUOBI,
];

const keyExtractor = ({ item }: { item: EExchange }) => item;

const DetailsPage = () => {
  const chartData = useAppSelector((store) => store.candles.data);
  const isLoadingCandles = useAppSelector((store) => store.candles.isLoading);
  const candlesError = useAppSelector((store) => store.candles.error);
  const isLoadingOrders = useAppSelector((store) => store.orders.isLoading);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const pairs = params.pairs || '';
  const exchange = (params.exchange as EExchange) || EExchange.BINANCE;

  const renderItem = useCallback(({ item }: { item: EExchange }) => item, []);

  useEffect(() => {
    const handlers: Record<EExchange, () => void> = {
      [EExchange.BINANCE]: () => dispatch(getBinanceCandles(pairs)),
      [EExchange.BITFINEX]: () => dispatch(getBitfinexCandles(pairs)),
      [EExchange.KRAKEN]: () => dispatch(getKrakenCandles(pairs)),
      [EExchange.HUOBI]: () => dispatch(getHuobiCandles(pairs)),
    };
    handlers[exchange]();
  }, [dispatch, pairs, exchange]);

  return (
    <DefaultLayout>
      <div className="flex justify-center">
        <Dropdown
          items={EXCHANGES}
          keyExtractor={keyExtractor}
          onPress={(item) => {
            navigate(`/${pairs}/details/${item}`);
          }}
          renderItem={renderItem}
          value={exchange}
        />
      </div>
      <section className="flex justify-center gap-4 py-8 align-center min-w-0 flex-col-reverse xl:flex-row 2xl:flex-row">
        <OrdersSection
          exchange={exchange}
          isLoading={isLoadingOrders}
          pair={pairs}
        />
        <Chart
          chartData={chartData}
          hasError={!!candlesError}
          isLoading={isLoadingCandles}
        />
      </section>
    </DefaultLayout>
  );
};

export default DetailsPage;
