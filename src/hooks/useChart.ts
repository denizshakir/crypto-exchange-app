import { useContext, useEffect } from 'react';
import {
  CandlestickSeries,
  createChart,
  TickMarkType,
  UTCTimestamp,
} from 'lightweight-charts';

import ThemeContext from '@/contexts/ThemeContext';
import { ICandleStick } from '@/types/candles';
import {
  chartDarkThemeOptions,
  chartLightThemeOptions,
} from '@/constants/chart';
import { CHART_HEIGHT } from '@/constants/common';

interface IUseChartParams {
  chartRef: React.RefObject<HTMLDivElement>;
  chartData: ICandleStick[];
  isLoading: boolean;
}

const useChart = (params: IUseChartParams) => {
  const { chartData, chartRef, isLoading } = params;
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (!chartRef.current || isLoading) return;

    const labels: string[] = [];
    const themeOptions =
      theme === 'dark' ? chartDarkThemeOptions : chartLightThemeOptions;
    const chart = createChart(chartRef.current, {
      ...themeOptions,
      timeScale: {
        ...themeOptions.timeScale,
        tickMarkFormatter: (ms: number, _: TickMarkType, locale: string) => {
          const date = new Date(ms);
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const day = String(date.getDate()).padStart(2, '0');
          const dateMonthLabel = `${day}-${month}`;

          if (labels.includes(dateMonthLabel)) {
            return date.toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // 24-hour format
            });
          }

          labels.push(dateMonthLabel);
          return dateMonthLabel;
        },
      },
      height: CHART_HEIGHT,
      width: chartRef.current.clientWidth,
      autoSize: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    const candleData = [...chartData]
      .sort((a, b) => a.time - b.time)
      .map((candle) => ({
        time: parseFloat(candle.ms) as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));
    candleSeries.setData(candleData);

    return () => {
      chart.remove();
    };
  }, [chartRef, chartData, isLoading, theme]);
};

export default useChart;
