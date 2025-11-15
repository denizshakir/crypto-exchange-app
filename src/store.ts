import { configureStore } from '@reduxjs/toolkit';

import candlesSliceReducer from './slices/candlesSlice';
import marketDataSliceReducer from './slices/marketDataSlice';
import ordersSlice from './slices/ordersSlice';
import tradesSliceReducer from './slices/tradesSlice';

const store = configureStore({
  reducer: {
    candles: candlesSliceReducer,
    marketData: marketDataSliceReducer,
    orders: ordersSlice,
    trades: tradesSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
