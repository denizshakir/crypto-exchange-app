import { FC, useCallback, useRef } from 'react';
import { Skeleton } from '@heroui/skeleton';
import { Card } from '@heroui/card';

import ErrorState from '@/components/ErrorState/ErrorState';
import { ICandleStick } from '@/types/candles';
import { CHART_HEIGHT } from '@/constants/common';
import useChart from '@/hooks/useChart';
import './Chart.css';

interface IChartProps {
  chartData: ICandleStick[];
  hasError?: boolean;
  isLoading?: boolean;
}

const Chart: FC<IChartProps> = (props) => {
  const { chartData, hasError, isLoading = false } = props;

  const chartRef = useRef<HTMLDivElement>(null);
  useChart({ chartRef, chartData, isLoading });

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <Skeleton className="rounded-lg" style={{ height: CHART_HEIGHT }} />
      );
    }

    if (hasError) {
      return (
        <ErrorState style={{ height: CHART_HEIGHT }}>
          Unable to load chart data.
        </ErrorState>
      );
    }

    return <div ref={chartRef} id="chart" />;
  }, [hasError, isLoading]);

  return (
    <Card className="p-4 w-full self-start ">
      <div id="chart-container" className="flex-1 shrink min-w-0">
        {renderContent()}
      </div>
    </Card>
  );
};

export default Chart;
