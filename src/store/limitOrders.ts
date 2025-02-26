import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CurrentLimitOrder, LimitOrder } from '../types/LimitOrder';
import { RootState } from './store';
import { getCurrencyData } from './spreadsheetList';

interface LimitOrdersState {
  currentBuyOrder: CurrentLimitOrder | null;
  currentSellOrder: CurrentLimitOrder | null;
  limitOrdersByCurrency: LimitOrder[];
}

const initialState: LimitOrdersState = {
  currentBuyOrder: null,
  currentSellOrder: null,
  limitOrdersByCurrency: [],
};

export const LimitOrdersSlice = createSlice({
  name: 'limitOrders',
  initialState,
  reducers: {
    addCurrentLimitOrder: (state, action: PayloadAction<CurrentLimitOrder>) => {
      if (action.payload.orderType === 'BUY') {
        state.currentBuyOrder = action.payload;
      } else {
        state.currentSellOrder = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLimitOrderByCurrency.fulfilled, (state, action) => {
        state.limitOrdersByCurrency = action.payload;
      })
      .addCase(fetchLimitOrderByCurrency.rejected, (state) => {
        state.limitOrdersByCurrency = [];
      });
  },
});

export const { addCurrentLimitOrder } = LimitOrdersSlice.actions;

export default LimitOrdersSlice.reducer;

// Selectors
export const getCurrentBuyOrder = (state: RootState) =>
  state.limitOrders.currentBuyOrder;
export const getCurrentSellOrder = (state: RootState) =>
  state.limitOrders.currentSellOrder;
export const getLimitOrdersByCurrency = (state: RootState) =>
  state.limitOrders.limitOrdersByCurrency;

type OrderType = 'BUY' | 'SELL';

export const postLimitOrder = createAsyncThunk(
  'app/postLimitOrder',
  async (orderType: OrderType, { getState }) => {
    const state = getState() as RootState;
    const currencyData = getCurrencyData(state);
    const desirableAssetsPercent = state.app.desirableAssetsPercent;

    if (!currencyData) {
      throw new Error('Currency data not found');
    }

    const limitOrder =
      orderType === 'BUY'
        ? getCurrentBuyOrder(state)
        : getCurrentSellOrder(state);

    if (!limitOrder) {
      throw new Error(`${orderType} limit order not found`);
    }
    const orderData = {
      ...limitOrder,
      currencyName: currencyData.name,
      desirableAssetsPercent,
    };
    const response = await fetch(
      'https://giftbox-backend-5d90.onrender.com/limit-orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      }
    );
    const result = await response.json();
    return result;
  }
);

export const fetchLimitOrderByCurrency = createAsyncThunk(
  'limitOrders/fetchByCurrency',
  async (currencyName: string) => {
    const response = await fetch(
      // `https://giftbox-backend-5d90.onrender.com/limit-orders/by-currency?currency=${currencyName}`,
      `http://localhost:3000/limit-orders/by-currency?currency=${currencyName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch limit orders');
    }

    const data = await response.json();
    return data;
  }
);
