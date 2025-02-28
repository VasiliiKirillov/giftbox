import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CurrentLimitOrder, LimitOrder } from '../types/LimitOrder';
import { RootState } from './store';
import { getCurrencyData } from './spreadsheetList';
import axios from 'axios';

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
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/limit-orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }
);

export const fetchLimitOrderByCurrency = createAsyncThunk(
  'limitOrders/fetchByCurrency',
  async (currencyName: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/limit-orders/by-currency`,
      {
        params: {
          currency: currencyName,
        },
      }
    );

    return response.data;
  }
);
