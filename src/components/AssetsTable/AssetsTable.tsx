import { FC, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import NumberFlow from '@number-flow/react';
import { Link } from '@heroui/link';
import { Skeleton } from '@heroui/skeleton';
import { Button } from '@heroui/button';

import TradesModal from '@/components/TradesModal/TradesModal';
import { ListIcon } from '@/components/Icons/Icons';
import {
  EExchange,
  EMarketDataColumn,
  IMarketDataItem,
} from '@/types/marketData';
import { formatNumber } from '@/utils/numberHelper';
import { EMPTY_CONTENT, EXCHANGES_COUNT } from '@/constants/common';
import { sortMarketData } from '@/utils/marketDataHelper';

interface IAssetsTableProps {
  isLoading: boolean;
  marketData: IMarketDataItem[];
}

const AssetsTable: FC<IAssetsTableProps> = (props) => {
  const { isLoading, marketData } = props;

  const [sortDescriptor, setSortDescriptor] = useState<
    SortDescriptor | undefined
  >();
  const [tradesModalData, setTradesModalData] = useState<{
    exchange: EExchange;
    ticker: string;
  } | null>(null);

  const navigate = useNavigate();

  const sortedData = useMemo(() => {
    if (!sortDescriptor) return marketData;

    return sortMarketData({
      marketData,
      column: sortDescriptor.column as EMarketDataColumn,
      direction: sortDescriptor.direction,
    });
  }, [marketData, sortDescriptor]);

  const onSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  const onCloseTradesModal = useCallback(() => {
    setTradesModalData(null);
  }, []);

  const renderRow = useCallback(
    (item: IMarketDataItem) => {
      if (
        item.ticker === null ||
        item.openingPrice === null ||
        item.lastTradePrice === null
      ) {
        return (
          <TableRow key={item.exchange} aria-labelledby="table-row">
            <TableCell>{item.exchange}</TableCell>
            <TableCell colSpan={4}>{'Not supported'}</TableCell>
          </TableRow>
        );
      }

      const [firstPair, secondPair] = item.ticker?.split('_') || [];
      const currentPrice = parseFloat(item?.lastTradePrice);
      const openPrice = parseFloat(item?.openingPrice);

      const change = currentPrice - openPrice;
      const percentChange = (change / openPrice) * 100;

      return (
        <TableRow key={item.exchange} aria-labelledby="table-row">
          <TableCell>
            <Link
              onClick={() => {
                navigate(
                  `/${firstPair}_${secondPair}/details/${item.exchange}`,
                );
              }}
            >
              {item.exchange}
            </Link>
          </TableCell>
          <TableCell>{firstPair?.toUpperCase()}</TableCell>
          <TableCell className="flex flex-row gap-2 justify-center items-center">
            <p>
              {secondPair?.toUpperCase()}{' '}
              {formatNumber(currentPrice, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            </p>

            <Button
              isIconOnly
              variant="light"
              onPress={() => {
                setTradesModalData({
                  exchange: item.exchange,
                  ticker: item.ticker || '',
                });
              }}
            >
              <ListIcon />
            </Button>
          </TableCell>
          <TableCell style={{ color: change >= 0 ? 'green' : 'red' }}>
            <NumberFlow
              value={change}
              format={{
                minimumFractionDigits: 2,
              }}
            />
            {' ('}
            <NumberFlow
              value={percentChange}
              format={{
                maximumFractionDigits: 2,
              }}
            />
            {') %'}
          </TableCell>
          <TableCell>
            {secondPair}{' '}
            <NumberFlow
              value={openPrice}
              format={{ minimumFractionDigits: 2 }}
            />
          </TableCell>
        </TableRow>
      );
    },
    [navigate],
  );

  return (
    <>
      <Table
        aria-labelledby="assets-table"
        className="font-mono flex h-auto"
        onSortChange={onSortChange}
        sortDescriptor={sortDescriptor}
      >
        <TableHeader aria-labelledby="table-header">
          <TableColumn
            aria-labelledby="column-1"
            key={EMarketDataColumn.Exchange}
          >
            Exchange
          </TableColumn>
          <TableColumn key={EMarketDataColumn.Asset}>Asset</TableColumn>
          <TableColumn allowsSorting key={EMarketDataColumn.Price}>
            Price
          </TableColumn>
          <TableColumn key={EMarketDataColumn.Change}>Change</TableColumn>
          <TableColumn key={EMarketDataColumn.OpeningPrice}>
            Opening price
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={EMPTY_CONTENT}
          isLoading={isLoading}
          className="h-auto flex"
          loadingContent={
            <div className="flex flex-col w-full p-4 gap-2 mt-10">
              {Array.from({ length: EXCHANGES_COUNT }).map((_, index) => (
                <Skeleton
                  className="w-full h-8 rounded-lg"
                  id="table-skeleton"
                  key={index}
                />
              ))}
            </div>
          }
        >
          <>{isLoading ? null : sortedData.map(renderRow)}</>
        </TableBody>
      </Table>
      {tradesModalData ? (
        <TradesModal
          exchange={tradesModalData.exchange}
          ticker={tradesModalData.ticker}
          onClose={onCloseTradesModal}
        />
      ) : null}
    </>
  );
};

export default AssetsTable;
