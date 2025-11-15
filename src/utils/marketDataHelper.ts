import { EMarketDataColumn, IMarketDataItem } from '@/types/marketData';

interface ISortMarketDataParams {
  marketData: IMarketDataItem[];
  column: EMarketDataColumn;
  direction: 'ascending' | 'descending';
}

export const sortMarketData = ({
  column,
  direction,
  marketData,
}: ISortMarketDataParams) => {
  const getItemValue = (item: IMarketDataItem) => {
    switch (column) {
      case EMarketDataColumn.Exchange:
        return item.exchange;
      case EMarketDataColumn.Asset:
        return item.ticker || '';
      case EMarketDataColumn.Price:
        return item.lastTradePrice
          ? parseFloat(item.lastTradePrice)
          : -Infinity;
      case EMarketDataColumn.Change:
        return -Infinity;
      case EMarketDataColumn.OpeningPrice:
        return item.openingPrice ? parseFloat(item.openingPrice) : -Infinity;
      default:
        return 0;
    }
  };

  const sorted = [...marketData].sort((a, b) => {
    const aValue = getItemValue(a);
    const bValue = getItemValue(b);

    return direction === 'ascending'
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
        ? 1
        : -1;
  });

  return sorted;
};
