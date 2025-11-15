import { ColorType, DeepPartial, TimeChartOptions } from 'lightweight-charts';

import { formatDateFromMillisToFull } from '@/utils/dateHelper';
import { EChartTheme } from '@/types/theme';

const localization = {
  dateFormat: 'dd-MM-yy',
  timeFormatter: (ms: number) => {
    return formatDateFromMillisToFull(ms);
  },
};

export const chartDarkThemeOptions: DeepPartial<TimeChartOptions> = {
  layout: {
    background: {
      color: '#1e1e1e',
      type: ColorType.Solid,
    },
    textColor: '#D9D9D9',
    panes: {
      enableResize: true,
    },
    colorSpace: 'srgb',
  },
  grid: {
    vertLines: {
      color: '#2B2B2B',
    },
    horzLines: { color: '#2B2B2B' },
  },
  crosshair: {
    mode: 0,
  },
  timeScale: {
    borderColor: '#2B2B2B',
    timeVisible: false,
  },
  leftPriceScale: {
    borderColor: '#2B2B2B',
  },
  rightPriceScale: {
    borderColor: '#2B2B2B',
  },
  localization,
};

export const chartLightThemeOptions: DeepPartial<TimeChartOptions> = {
  layout: {
    background: {
      color: '#FFFFFF',
      type: ColorType.Solid,
    },
    textColor: '#1E1E1E',
    panes: {
      enableResize: true,
    },
    colorSpace: 'srgb',
  },
  grid: {
    vertLines: {
      color: '#E6E6E6',
    },
    horzLines: {
      color: '#E6E6E6',
    },
  },
  crosshair: {
    mode: 0,
  },
  timeScale: {
    borderColor: '#E6E6E6',
    timeVisible: false,
  },
  leftPriceScale: {
    borderColor: '#E6E6E6',
  },
  rightPriceScale: {
    borderColor: '#E6E6E6',
  },
  localization,
};

export const CHART_THEME = {
  [EChartTheme.DARK]: chartDarkThemeOptions,
  [EChartTheme.LIGHT]: chartLightThemeOptions,
};
