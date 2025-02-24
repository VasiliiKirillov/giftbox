import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { getCurrencyData } from './spreadsheetList';
import { getSellOrder } from './limitOrders';
import { getBuyOrder } from './limitOrders';

interface AppState {
  desirableAssetsPercent: string;
}

const initialState: AppState = {
  desirableAssetsPercent: '',
};

export const AppSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDesirableAssetsPercent: (state, action: PayloadAction<string>) => {
      state.desirableAssetsPercent = action.payload;
    },
  },
});

export const { setDesirableAssetsPercent } = AppSlice.actions;

export default AppSlice.reducer;

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

    // Get the appropriate limit order based on order type
    const limitOrder =
      orderType === 'BUY' ? getBuyOrder(state) : getSellOrder(state);

    if (!limitOrder) {
      throw new Error(`${orderType} limit order not found`);
    }
    // Accumulate the data we need
    const orderData = {
      ...limitOrder,
      currencyName: currencyData.name,
      desirableAssetsPercent,
    };
    // add axios post request
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
