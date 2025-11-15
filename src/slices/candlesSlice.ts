import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  fetchBinanceCandles,
  fetchBitfinexCandles,
  fetchHuobiCandles,
  fetchKrakenCandles,
} from '@/services/candlesService';
import { extractSymbolId } from '@/utils/symbolHelper';
import { ICandleStick } from '@/types/candles';

const UNIX_TO_MS_MULTIPLIER = 1000;

export const getBinanceCandles = createAsyncThunk(
  'candles/getBinanceCandles',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toUpperCase();
    const response = await fetchBinanceCandles({ symbolId: symbolIdValue });
    const data: ICandleStick[] = response.map((item) => ({
      open: parseFloat(item[1]),
      close: parseFloat(item[4]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      ms: item[0].toString(),
      time: item[0],
    }));

    return data;
  },
);

export const getKrakenCandles = createAsyncThunk(
  'candles/getKrakenCandles',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toUpperCase();
    const response = await fetchKrakenCandles({ symbolId: symbolIdValue });
    response.result.last;
    const [key] = Object.keys(response.result).filter((k) => k !== 'last');
    const candles = response.result[key];
    const data: ICandleStick[] = Array.isArray(candles)
      ? candles.map((item) => ({
          open: parseFloat(item[1]),
          close: parseFloat(item[4]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          ms: (item[0] * UNIX_TO_MS_MULTIPLIER).toString(),
          time: item[0],
        }))
      : [];

    return data;
  },
);

export const getBitfinexCandles = createAsyncThunk(
  'candles/getBitfinexCandles',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toUpperCase();
    const response = await fetchBitfinexCandles({ symbolId: symbolIdValue });
    const data: ICandleStick[] = response.map((item) => ({
      open: item[1],
      close: item[2],
      high: item[3],
      low: item[4],
      ms: item[0].toString(),
      time: item[0],
    }));

    return data;
  },
);

export const getHuobiCandles = createAsyncThunk(
  'chart/getHuobiCandles',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toLowerCase();
    const response = await fetchHuobiCandles({ symbolId: symbolIdValue });
    const data: ICandleStick[] = response.data.map((item) => ({
      open: item.open,
      close: item.close,
      high: item.high,
      low: item.low,
      ms: (item.id * UNIX_TO_MS_MULTIPLIER).toString(),
      time: item.id,
    }));

    return data;
  },
);

const addAsyncThunkHandler = <T extends ICandleStick[]>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<T, string, {}>,
) => {
  builder.addCase(thunk.pending, (state) => {
    state.data = [];
    state.error = null;
    state.isLoading = true;
  });
  builder.addCase(thunk.rejected, (state, action) => {
    state.data = [];
    state.isLoading = false;
    state.error = action.error.message || 'Failed to fetch data';
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    state.data = action.payload;
    state.isLoading = false;
    state.error = null;
  });
};

type State = {
  data: ICandleStick[];
  error: string | null;
  isLoading: boolean;
};

const initialState: State = {
  data: [],
  error: null,
  isLoading: false,
};

const candlesSlice = createSlice({
  name: 'candles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncThunkHandler(builder, getBinanceCandles);
    addAsyncThunkHandler(builder, getKrakenCandles);
    addAsyncThunkHandler(builder, getBitfinexCandles);
    addAsyncThunkHandler(builder, getHuobiCandles);
  },
});

export default candlesSlice.reducer;
