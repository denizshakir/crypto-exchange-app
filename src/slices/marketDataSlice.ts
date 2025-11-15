import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  fetchBinanceTicker,
  fetchBitfinexTicker,
  fetchHuobiTicker,
  fetchKrakenTicker,
} from '@/services/marketDataService';
import { extractSymbolId } from '@/utils/symbolHelper';
import { EExchange, ITicker } from '@/types/marketData';

type TExchangeState = {
  data: ITicker | null;
  loading: boolean;
  error: string | null;
};

type State = Partial<Record<EExchange, TExchangeState>>;

const initialState: State = {};

export const getTickerKraken = createAsyncThunk(
  'ticker/getTickerKraken',
  async (symbolId: string) => {
    const response = await fetchKrakenTicker(extractSymbolId(symbolId));
    if (!response) return null;

    const [key] = Object.keys(response.result);

    const tickerData = response.result[key];

    const ticker: ITicker = {
      lastTradePrice: tickerData.c[0],
      openingPrice: tickerData.o,
      ticker: symbolId,
    };

    return ticker;
  },
);

export const getTickerBinance = createAsyncThunk(
  'ticker/getTickerBinance',
  async (symbolId: string) => {
    const response = await fetchBinanceTicker(
      extractSymbolId(symbolId.split('/').join('')).toUpperCase(),
    );
    if (!response) return null;

    // const tickerData = response.data;
    const tickerData = response;

    const ticker: ITicker = {
      lastTradePrice: tickerData.lastPrice,
      openingPrice: tickerData.openPrice,
      ticker: symbolId,
    };

    return ticker;
  },
);

export const getTickerHuobi = createAsyncThunk(
  'ticker/getTickerHuobi',
  async (symbolId: string) => {
    const response = await fetchHuobiTicker(
      extractSymbolId(symbolId).toLowerCase(),
    );

    if (!response) return null;

    // const tickerData = response.data.tick;
    const tickerData = response.tick;

    const ticker: ITicker = {
      lastTradePrice: tickerData.close.toString(),
      openingPrice: tickerData.open.toString(),
      ticker: symbolId,
    };

    return ticker;
  },
);

export const getTickerBitfinex = createAsyncThunk(
  'ticker/getTickerBitfinex',
  async (symbolId: string) => {
    const symbolIdExtended = extractSymbolId(symbolId).toUpperCase();
    const response = await fetchBitfinexTicker(symbolIdExtended);
    if (!Array.isArray(response)) return null;

    const tickerData = response;
    const lastTradePrice = tickerData[6];
    const dailyChange = tickerData[4];

    const ticker: ITicker = {
      lastTradePrice: lastTradePrice.toString(),
      openingPrice: (lastTradePrice - dailyChange).toString(),
      ticker: symbolId.toUpperCase(),
    };

    return ticker;
  },
);

const addAsyncThunkHandler = <T extends ITicker | null>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<T, string, {}>,
  exchange: keyof State,
) => {
  builder.addCase(thunk.pending, (state) => {
    state[exchange] = { data: null, loading: true, error: null };
  });
  builder.addCase(thunk.rejected, (state, action) => {
    state[exchange] = {
      data: null,
      loading: false,
      error: action.error.message || 'Failed to fetch data',
    };
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    state[exchange] = {
      data: action.payload,
      loading: false,
      error: null,
    };
  });
};

const marketDataSlice = createSlice({
  name: 'marketData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncThunkHandler(builder, getTickerKraken, EExchange.KRAKEN);
    addAsyncThunkHandler(builder, getTickerBinance, EExchange.BINANCE);
    addAsyncThunkHandler(builder, getTickerHuobi, EExchange.HUOBI);
    addAsyncThunkHandler(builder, getTickerBitfinex, EExchange.BITFINEX);
  },
});

export default marketDataSlice.reducer;
