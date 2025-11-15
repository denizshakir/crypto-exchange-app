import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  fetchBinanceTrades,
  fetchBitfinexTrades,
  fetchHuobiTrades,
  fetchKrakenTrades,
} from '@/services/tradesService';
import { extractSymbolId } from '@/utils/symbolHelper';
import { ITrade } from '@/types/trades';

export const getBinanceTrades = createAsyncThunk(
  'trades/getBinanceTrades',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toUpperCase();
    const response = await fetchBinanceTrades({ symbolId: symbolIdValue });
    if (!response) return []; // Handle null response

    const trades: ITrade[] = response.map((item) => ({
      amount: parseFloat(item.qty),
      price: parseFloat(item.price),
    }));

    return trades;
  },
);

export const getKrakenTrades = createAsyncThunk(
  'trade/getKrakenTrades',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toUpperCase();
    const response = await fetchKrakenTrades({ symbolId: symbolIdValue });

    if (!response) return [];

    const [key] = Object.keys(response.result).filter((key) => key !== 'last');

    const data = response.result[key];
    const trades: ITrade[] = Array.isArray(data)
      ? data.map((item) => ({
          amount: parseFloat(item[1]),
          price: parseFloat(item[0]),
        }))
      : [];

    return trades;
  },
);

export const getBitfinexTrades = createAsyncThunk(
  'trade/getBitfinexTrades',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toUpperCase();
    const response = await fetchBitfinexTrades({ symbolId: symbolIdValue });

    if (!response) return [];

    const trades: ITrade[] = response.map((item) => ({
      amount: item[2],
      price: item[3],
    }));

    return trades;
  },
);

export const getHuobiTrades = createAsyncThunk(
  'trade/getHuobiTrades',
  async (symbolId: string) => {
    const symbolIdValue = extractSymbolId(symbolId).toLocaleLowerCase();
    const response = await fetchHuobiTrades({ symbolId: symbolIdValue });

    if (!response) return [];

    const trades: ITrade[] = response.data.map((item) => ({
      amount: item.data[0].amount,
      price: item.data[0].price,
    }));

    return trades;
  },
);

type State = {
  error: string | null;
  data: ITrade[];
  loading: boolean;
};

const initialState: State = {
  data: [],
  error: null,
  loading: false,
};

const addAsyncThunkHandler = <T extends ITrade[]>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<T, string, {}>,
) => {
  builder.addCase(thunk.pending, (state) => {
    state.data = [];
    state.error = null;
    state.loading = true;
  });
  builder.addCase(thunk.rejected, (state, action) => {
    state.data = [];
    state.loading = false;
    state.error = action.error.message || 'Failed to fetch data';
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    state.data = action.payload;
    state.loading = false;
    state.error = null;
  });
};

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncThunkHandler(builder, getBinanceTrades);
    addAsyncThunkHandler(builder, getKrakenTrades);
    addAsyncThunkHandler(builder, getBitfinexTrades);
    addAsyncThunkHandler(builder, getHuobiTrades);
  },
});

export default tradesSlice.reducer;
