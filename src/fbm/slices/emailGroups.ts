import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { RootState } from '../misc/store';
import API from '../misc/api';
import { BaseError } from '../misc/commonTypes';
import { addNewEmailGroup, EmailGroup } from './emailGroupsDetailed';
import { fakeDelay } from '../misc/utils';

type EmailGroupsDataState = {
  emailGroups: Array<EmailGroup>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: EmailGroupsDataState = {
  emailGroups: [],
  status: 'idle',
  error: null,
};

export const emailGroupsSlice = createSlice({
  name: 'emailGroups',
  initialState,
  reducers: {
    changeNameInCommonGroups: (state, action) => {
      state.emailGroups = state.emailGroups.map((emailGroup) => {
        if (emailGroup.id === action.payload.groupId) {
          return {
            ...emailGroup,
            name: action.payload.name,
          };
        } else return { ...emailGroup };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailGroups.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmailGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.emailGroups = action.payload;
      })
      .addCase(fetchEmailGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '';
      })
      .addCase(deleteEmailGroup.fulfilled, (state, action) => {
        state.emailGroups = state.emailGroups.filter(
          (emailGroup) => emailGroup.id !== action.payload
        );
      })
      .addCase(addNewEmailGroup.fulfilled, (state, action) => {
        const newEmailGroup = action.payload;

        state.emailGroups.unshift({
          id: newEmailGroup.id,
          name: newEmailGroup.name,
          createdAt: newEmailGroup.createdAt,
          updatedAt: newEmailGroup.updatedAt,
        });
      });
  },
});

export const fetchEmailGroups = createAsyncThunk(
  'emailGroups/fetchEmailGroups',
  async () => {
    try {
      await fakeDelay();
      return emailGroups;
    } catch (error) {
      const baseError = error as BaseError;
      const errorDetail = baseError?.response?.data?.detail;
      const errorMessage = `Fetching email groups data error
          ${errorDetail ? `Details: ${errorDetail}` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const deleteEmailGroup = createAsyncThunk(
  'emailGroups/deleteEmailGroup',
  async (emailGroupId: string) => {
    try {
      await API.delete(`/mailing-group/${emailGroupId}`);
      return emailGroupId;
    } catch (error) {
      const baseError = error as BaseError;
      const errorDetail = baseError?.response?.data?.detail;
      const errorMessage = `Deleting email group error
          ${errorDetail ? `Details: ${errorDetail}` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const HOME_EMAIL_GROUPS_AMOUNT = 4;

export const getEmailGroups = (state: RootState) =>
  state.emailGroupsData.emailGroups;
export const getEmailGroupsStatus = (state: RootState) =>
  state.emailGroupsData.status;
export const getIsEmailGroupsEmpty = createSelector(
  getEmailGroups,
  getEmailGroupsStatus,
  (emailGroups, status) => emailGroups.length === 0 && status === 'succeeded'
);
export const getHomeScreenEmailGroups = createSelector(
  getEmailGroups,
  (emailGroups) => emailGroups.slice(0, HOME_EMAIL_GROUPS_AMOUNT)
);
export const getEmailGroupsAmount = createSelector(
  getEmailGroups,
  (emailGroups) => emailGroups.length
);
export const getIsEmailGroupsExists = createSelector(
  getEmailGroups,
  getEmailGroupsStatus,
  (emailGroups, emailGroupsStatus) =>
    emailGroups.length > 0 && emailGroupsStatus === 'succeeded'
);

export const { changeNameInCommonGroups } = emailGroupsSlice.actions;

export default emailGroupsSlice.reducer;

const emailGroups = [
  { id: '1', name: 'Group 1', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '2', name: 'Group 2', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '3', name: 'Group 3', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '4', name: 'Group 4', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '5', name: 'Group 5', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '6', name: 'Group 6', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '7', name: 'Group 7', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '8', name: 'Group 8', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '9', name: 'Group 9', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '10', name: 'Group 10', createdAt: Date.now(), updatedAt: Date.now() },
];
