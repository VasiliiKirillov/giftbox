import { configureStore } from '@reduxjs/toolkit';

import userReducer from '../slices/user';
import counterReducer from '../slices/campaigns';
import emailAssetsReducer from '../slices/emailAssets';
import emailGroupsReducer from '../slices/emailGroups';
import emailGroupsDetailedReducer from '../slices/emailGroupsDetailed';

export const store = configureStore({
  reducer: {
    userData: userReducer,
    campaignsData: counterReducer,
    emailAssetsData: emailAssetsReducer,
    emailGroupsData: emailGroupsReducer,
    emailGroupsDetailedData: emailGroupsDetailedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
