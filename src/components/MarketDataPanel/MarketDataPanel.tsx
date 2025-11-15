import { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';

import MarketDataPanelSkeleton from '@/components/MarketDataPanelSkeleton/MarketDataPanelSkeleton';
import { IMarketDataPanelItem } from '@/types/marketData';
import { formatNumber } from '@/utils/numberHelper';
import { EMPTY_CONTENT } from '@/constants/common';

const COLORS: { [K in TPriceColor]: string } = {
  green: 'text-green-500',
  red: 'text-red-500',
};

const [priceMinDigits, priceMaxDigits] = [2, 4];

type TPriceColor = 'red' | 'green';

interface IMarketDataPanelProps<T> {
  data: T[];
  ticker: string;
  emptyContent?: string;
  isLoading?: boolean;
  priceColor?: TPriceColor;
}

const MarketDataPanel = <T extends IMarketDataPanelItem>(
  props: IMarketDataPanelProps<T>,
) => {
  const {
    data,
    emptyContent = EMPTY_CONTENT,
    isLoading,
    priceColor,
    ticker,
  } = props;

  const [firstPair, secondPair] = ticker?.split('_') || [];
  const priceCellClassName = `text-left ${priceColor ? COLORS[priceColor] : ''}`;

  if (isLoading) {
    return <MarketDataPanelSkeleton />;
  }

  return (
    <Table
      title="Order book"
      aria-label="order-book-table"
      className="font-mono table-fixed"
    >
      <TableHeader>
        <TableColumn className="text-left">Price ({secondPair})</TableColumn>
        <TableColumn className="text-right">Amount ({firstPair})</TableColumn>
        <TableColumn className="text-right">Total</TableColumn>
      </TableHeader>
      <TableBody emptyContent={emptyContent}>
        {data.map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell className={priceCellClassName}>
                {formatNumber(item.price, {
                  minimumFractionDigits: priceMinDigits,
                  maximumFractionDigits: priceMaxDigits,
                })}
              </TableCell>
              <TableCell className="text-right">
                {formatNumber(item.amount, {
                  maximumFractionDigits: 8,
                })}
              </TableCell>
              <TableCell className="text-right">
                {formatNumber(item.amount * item.price, {
                  minimumFractionDigits: priceMinDigits,
                  maximumFractionDigits: priceMaxDigits,
                })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default memo(MarketDataPanel);
