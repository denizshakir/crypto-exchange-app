import { useNavigate } from 'react-router-dom';
import { Input } from '@heroui/input';
import { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';

import AssetsTable from '@/components/AssetsTable/AssetsTable';
import useAppSelector from '@/hooks/useAppSelector';
import useAppDispatch from '@/hooks/useAppDispatch';
import {
  getTickerBinance,
  getTickerBitfinex,
  getTickerHuobi,
  getTickerKraken,
} from '@/slices/marketDataSlice';
import { extractSymbolId } from '@/utils/symbolHelper';
import { EExchange, IMarketDataItem } from '@/types/marketData';

interface ISearchAssetsProps {
  pair?: string;
}

const SearchAssets: FC<ISearchAssetsProps> = (props) => {
  const { pair = '' } = props;

  const marketData = useAppSelector((store) => store.marketData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const pairValue = extractSymbolId(pair, '/').toUpperCase();

  const isLoading = useMemo(
    () =>
      Object.keys(marketData).some(
        (exchange) => marketData[exchange as EExchange]?.loading,
      ),
    [marketData],
  );

  const tableData = useMemo(() => {
    return Object.entries(marketData).map(([exchange, state]) => {
      const data = state.data;
      const item: IMarketDataItem = {
        exchange: exchange as EExchange,
        ticker: data?.ticker || null,
        lastTradePrice: data?.lastTradePrice || null,
        openingPrice: data?.openingPrice || null,
      };

      return item;
    });
  }, [marketData]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigate(`/${newValue.split('/').join('_').toUpperCase()}`);
      }, 500);
    },
    [navigate],
  );

  const onSearch = useCallback(async () => {
    if (!pair) return;

    dispatch(getTickerKraken(pair));
    dispatch(getTickerBinance(pair));
    dispatch(getTickerHuobi(pair));
    dispatch(getTickerBitfinex(pair));
  }, [dispatch, pair]);

  useEffect(() => {
    onSearch();
  }, [onSearch]);

  return (
    <div className="flex flex-col items-center w-full gap-6" id="search-assets">
      <Input
        className="w-full sm:w-64 md:w-80 lg:w-96 uppercase"
        fullWidth={false}
        onChange={onChange}
        placeholder="Search for an asset e.g. BTC/USD"
        size="lg"
        defaultValue={pairValue}
        aria-labelledby="search-input"
      />
      <AssetsTable marketData={tableData} isLoading={isLoading} />
    </div>
  );
};

export default memo(SearchAssets);
