import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { RootState } from '../misc/store';
import API from '../misc/api';
import { BaseError } from '../misc/commonTypes';
import { fakeDelay } from '../misc/utils';

export type Campaign = {
  id: string;
  name: string;
  state: 'init' | 'processing' | 'finished';
  createdAt: number;
  amountOfMessagesSent: number;
  totalMessages: number;
};

type CampaignsDataState = {
  campaigns: Array<Campaign>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: CampaignsDataState = {
  campaigns: [],
  status: 'idle',
  error: null,
};

export const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.campaigns = action.payload as Campaign[];
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '';
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.campaigns = [action.payload, ...state.campaigns];
      });
  },
});

export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async () => {
    try {
      await fakeDelay();
      return emailCampaigns;
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Fetching campaigns data error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (campaignData: {
    campaignContent: string;
    campaignSubject: string;
    campaignName: string;
    pickedEmailGroupId: string;
  }) => {
    try {
      const response = await API.post('/task', {
        messageContent: campaignData.campaignContent,
        subject: campaignData.campaignSubject,
        name: campaignData.campaignName,
        mailingGroupId: campaignData.pickedEmailGroupId,
      });
      return response.data.task;
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Creating campaign error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const sendTestEmail = createAsyncThunk(
  'campaigns/sendTestEmail',
  async (campaignData: {
    campaignContent: string;
    campaignSubject: string;
  }) => {
    try {
      await API.post('/task/test', {
        messageContent: campaignData.campaignContent,
        subject: campaignData.campaignSubject,
      });
      toast.success('Email sent!');
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Creating campaign error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const HOME_CAMPAIGNS_AMOUNT = 4;

export const getCampaignsStatus = (state: RootState) =>
  state.campaignsData.status;
export const getCampaigns = (state: RootState) => state.campaignsData.campaigns;
export const getHomeScreenCampaigns = createSelector(
  getCampaigns,
  (campaigns) => campaigns.slice(0, HOME_CAMPAIGNS_AMOUNT)
);
export const getIsCampaignsEmpty = createSelector(
  getCampaigns,
  getCampaignsStatus,
  (campaigns, status) => campaigns.length === 0 && status === 'succeeded'
);
export const getCampaignsAmount = createSelector(
  getCampaigns,
  (campaigns) => campaigns.length
);
export const getIsCampaignsExists = createSelector(
  getCampaigns,
  getCampaignsStatus,
  (campaigns, status) => campaigns.length > 0 && status === 'succeeded'
);

export default campaignsSlice.reducer;

const emailCampaigns = [
  {
    id: '1',
    name: 'Campaign 1',
    state: 'init',
    createdAt: Date.now(),
    amountOfMessagesSent: 0,
    totalMessages: 100,
  },
  {
    id: '2',
    name: 'Campaign 2',
    state: 'processing',
    createdAt: Date.now(),
    amountOfMessagesSent: 50,
    totalMessages: 200,
  },
  {
    id: '3',
    name: 'Campaign 3',
    state: 'finished',
    createdAt: Date.now(),
    amountOfMessagesSent: 200,
    totalMessages: 200,
  },
  {
    id: '4',
    name: 'Campaign 4',
    state: 'init',
    createdAt: Date.now(),
    amountOfMessagesSent: 0,
    totalMessages: 150,
  },
  {
    id: '5',
    name: 'Campaign 5',
    state: 'processing',
    createdAt: Date.now(),
    amountOfMessagesSent: 100,
    totalMessages: 300,
  },
  {
    id: '6',
    name: 'Campaign 6',
    state: 'finished',
    createdAt: Date.now(),
    amountOfMessagesSent: 300,
    totalMessages: 300,
  },
  {
    id: '7',
    name: 'Campaign 7',
    state: 'init',
    createdAt: Date.now(),
    amountOfMessagesSent: 0,
    totalMessages: 120,
  },
  {
    id: '8',
    name: 'Campaign 8',
    state: 'processing',
    createdAt: Date.now(),
    amountOfMessagesSent: 80,
    totalMessages: 250,
  },
  {
    id: '9',
    name: 'Campaign 9',
    state: 'finished',
    createdAt: Date.now(),
    amountOfMessagesSent: 250,
    totalMessages: 250,
  },
  {
    id: '10',
    name: 'Campaign 10',
    state: 'init',
    createdAt: Date.now(),
    amountOfMessagesSent: 0,
    totalMessages: 180,
  },
];
