import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
