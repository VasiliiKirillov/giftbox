import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '../misc/store';
import API from '../misc/api';
import { BaseError } from '../misc/commonTypes';
import { toast } from 'react-toastify';
import { fakeDelay } from '../misc/utils';

export type EmailAsset = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  subject: string;
  content?: string;
};

type EmailAssetsDataState = {
  emailAssets: Array<EmailAsset>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: EmailAssetsDataState = {
  emailAssets: [],
  status: 'idle',
  error: null,
};

export const emailAssetsSlice = createSlice({
  name: 'emailAssets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailAssets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmailAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.emailAssets = action.payload;
      })
      .addCase(fetchEmailAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '';
      })
      .addCase(deleteEmailAsset.fulfilled, (state, action) => {
        state.emailAssets = state.emailAssets.filter(
          (emailAsset) => emailAsset.id !== action.payload
        );
      })
      .addCase(createEmailAsset.fulfilled, (state, action) => {
        state.emailAssets = [action.payload, ...state.emailAssets];
      })
      .addCase(updateEmailAsset.fulfilled, (state, action) => {
        state.emailAssets = state.emailAssets.map((emailAsset) =>
          emailAsset.id === action.payload.id ? action.payload : emailAsset
        );
      })
      .addCase(getEmailAssetById.fulfilled, (state, action) => {
        state.emailAssets = state.emailAssets.map((emailAsset) =>
          emailAsset.id === action.payload.id ? action.payload : emailAsset
        );
      });
  },
});

export const fetchEmailAssets = createAsyncThunk(
  'campaigns/fetchEmailAssets',
  async () => {
    try {
      await fakeDelay(500);
      throw Error();
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorDetail = baseError?.response?.data?.detail;
      const errorMessage = `Fetching email assets data error
          ${errorStatus ? `Status: ${errorStatus};` : ''}
          ${errorDetail ? `Details: ${errorDetail}` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const deleteEmailAsset = createAsyncThunk(
  'emailGroups/deleteEmailAsset',
  async (emailAssetId: string) => {
    try {
      await API.delete('/message-template', {
        data: {
          id: emailAssetId,
        },
      });
      return emailAssetId;
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Deleting email asset error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const createEmailAsset = createAsyncThunk(
  'emailGroups/postEmailAsset',
  async (assetData: {
    assetName: string;
    assetSubject: string;
    assetContent: string;
  }) => {
    try {
      const response = await API.post('/message-template', {
        name: assetData.assetName,
        subject: assetData.assetSubject,
        content: assetData.assetContent,
      });
      return response.data.template;
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Creation email asset error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const updateEmailAsset = createAsyncThunk(
  'emailGroups/updateEmailAsset',
  async (assetData: {
    assetId: string;
    assetName: string;
    assetSubject: string;
    assetContent: string;
  }) => {
    try {
      const response = await API.patch('/message-template', {
        id: assetData.assetId,
        name: assetData.assetName,
        subject: assetData.assetSubject,
        content: assetData.assetContent,
      });
      return response.data;
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Update email asset error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const getEmailAssetById = createAsyncThunk<EmailAsset, string>(
  'emailGroups/getEmailAssetById',
  async (assetId: string) => {
    try {
      const response = await API.get(`/message-template/${assetId}`);
      return response.data;
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Get email asset by id error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const HOME_EMAIL_ASSETS_AMOUNT = 4;

export const getEmailAssets = (state: RootState) =>
  state.emailAssetsData.emailAssets;
export const getEmailAssetsStatus = (state: RootState) =>
  state.emailAssetsData.status;
export const getIsEmailAssetsEmpty = createSelector(
  getEmailAssets,
  getEmailAssetsStatus,
  (emailAssets, status) => emailAssets.length === 0 && status === 'succeeded'
);
export const getEmailAssetsAmount = createSelector(
  getEmailAssets,
  (assets) => assets.length
);
export const getHomeEmailAssets = createSelector(getEmailAssets, (assets) =>
  assets.slice(0, HOME_EMAIL_ASSETS_AMOUNT)
);
export const getIsEmailAssetsExists = createSelector(
  getEmailAssets,
  getEmailAssetsStatus,
  (assets, assetsStatus) => assets.length > 0 && assetsStatus === 'succeeded'
);
export const getEmailAssetsById = createSelector(
  getEmailAssets,
  (emailAssets) =>
    emailAssets.reduce((acc: Record<string, EmailAsset>, item) => {
      acc[`${item.id}`] = item;
      return acc;
    }, {})
);

export default emailAssetsSlice.reducer;
