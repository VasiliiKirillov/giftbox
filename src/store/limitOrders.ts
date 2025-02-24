import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LimitOrder } from '../types/LimitOrder';

interface LimitOrdersState {
  buyOrder: LimitOrder | null;
  sellOrder: LimitOrder | null;
}

const initialState: LimitOrdersState = {
  buyOrder: null,
  sellOrder: null,
};

export const LimitOrdersSlice = createSlice({
  name: 'limitOrders',
  initialState,
  reducers: {
    addLimitOrder: (state, action: PayloadAction<LimitOrder>) => {
      if (action.payload.orderType === 'BUY') {
        state.buyOrder = action.payload;
      } else {
        state.sellOrder = action.payload;
      }
    },
  },
});

export const { addLimitOrder } = LimitOrdersSlice.actions;

export default LimitOrdersSlice.reducer;
