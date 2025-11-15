import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IOrderItem } from '@/types/orders';

const SIZE = 10;
const sortAsks = (a: IOrderItem, b: IOrderItem) => b.price - a.price;

type State = {
  data: {
    asks: IOrderItem[];
    bids: IOrderItem[];
  };
  error: string | null;
  hasError: boolean;
  isDataLoaded: boolean;
  isLoading: boolean;
};

const initialState: State = {
  data: {
    asks: [],
    bids: [],
  },
  error: null,
  hasError: false,
  isLoading: true,
  isDataLoaded: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setIsDataLoaded(state, action: PayloadAction<boolean>) {
      state.isDataLoaded = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    syncAsks(state, action: PayloadAction<IOrderItem[]>) {
      const newAsks = state.data.asks.filter((b) =>
        action.payload.every((p) => p.price !== b.price),
      );
      action.payload.forEach((bid) => {
        if (bid.quantity !== 0) newAsks.push(bid);
      });

      const sliceStart = newAsks.length - SIZE < 0 ? 0 : newAsks.length - SIZE;
      state.data.asks = newAsks
        .sort(sortAsks)
        .slice(sliceStart, newAsks.length);
    },

    syncBids(state, action: PayloadAction<IOrderItem[]>) {
      const newBids = state.data.bids.filter((b) =>
        action.payload.every((p) => p.price !== b.price),
      );
      action.payload.forEach((bid) => {
        if (bid.quantity !== 0) newBids.push(bid);
      });

      state.data.bids = newBids
        .sort((a, b) => b.price - a.price)
        .slice(0, SIZE);
    },
    setAsks(state, action: PayloadAction<IOrderItem[]>) {
      state.data.asks = [...action.payload].sort(sortAsks);
    },
    setBids(state, action: PayloadAction<IOrderItem[]>) {
      state.data.bids = action.payload;
    },
    removeAsk(state, action: PayloadAction<IOrderItem>) {
      const newAsks = state.data.asks.filter(
        (ask) => ask.price !== action.payload.price,
      );
      state.data.asks = newAsks;
    },
    removeBid(state, action: PayloadAction<IOrderItem>) {
      const newBids = state.data.bids.filter(
        (bid) => bid.price !== action.payload.price,
      );
      state.data.bids = newBids;
    },
    setHasError(state, action: PayloadAction<boolean>) {
      state.hasError = action.payload;
    },
  },
});

export const {
  removeAsk,
  removeBid,
  syncAsks,
  syncBids,

  setAsks,
  setBids,
  setHasError,
  setIsLoading,
  setIsDataLoaded,
} = ordersSlice.actions;

export default ordersSlice.reducer;
