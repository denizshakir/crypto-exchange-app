import { FC, memo } from 'react';
import { Skeleton } from '@heroui/skeleton';
import { Card } from '@heroui/card';

const DEFAULT_LENGTH = 10;

interface IMarketDataPanelSkeletonProps {
  length?: number;
}

const MarketDataPanelSkeleton: FC<IMarketDataPanelSkeletonProps> = (props) => {
  const { length = DEFAULT_LENGTH } = props;

  return (
    <Card className="p-4">
      <Skeleton className="rounded-lg h-10 mb-2" />
      <div className="flex flex-col gap-2">
        {Array.from({ length }).map((_, index) => (
          <div key={index} className="flex gap-2 flex-row">
            <Skeleton className="rounded-lg h-5 w-25" />
            <Skeleton className="rounded-lg h-5 w-25" />
            <Skeleton className="rounded-lg h-5 w-25" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default memo(MarketDataPanelSkeleton);
