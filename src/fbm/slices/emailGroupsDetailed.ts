import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { RootState } from '../misc/store';
import API from '../misc/api';
import { BaseError } from '../misc/commonTypes';
import { changeNameInCommonGroups } from './emailGroups';

type EmailGroupId = string;

export type EmailGroup = {
  id: EmailGroupId;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type Email = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  unsubscribedLocal: boolean;
  unsubscribedAt: number;
  blockedGlobal: boolean;
  blockedGlobalReason: string;
  blockedGlobalAt: number;
};

export type EmailGroupDetailed = EmailGroup & {
  emails: Email[];
  totalSize: number;
};

type EmailGroupsDetailedDataState = Record<
  EmailGroupId,
  {
    emailGroup: EmailGroupDetailed;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
  }
>;

const initialState: EmailGroupsDetailedDataState = {};

export const emailGroupsDetailedSlice = createSlice({
  name: 'emailGroupsDetailed',
  initialState,
  reducers: {
    loading: (state, action) => ({
      ...state,
      [action.payload]: {
        status: 'loading',
      },
    }),
    fulfilled: (state, action) => ({
      ...state,
      [action.payload.emailGroup.id]: {
        status: 'succeeded',
        emailGroup: action.payload.emailGroup,
      },
    }),
    rejected: (state, action) => ({
      ...state,
      [action.payload.id]: {
        status: 'failed',
      },
    }),
    changedName: (state, action) => ({
      ...state,
      [action.payload.groupId]: {
        status: 'succeeded',
        emailGroup: {
          ...state[action.payload.groupId].emailGroup,
          name: action.payload.name,
        },
      },
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteEmailFromGroup.fulfilled, (state, action) => {
        const emailGroup = state[action.payload.emailGroupId].emailGroup;
        const updatedEmails = emailGroup.emails.filter(
          (email) => email.id !== action.payload.emailId
        );

        return {
          ...state,
          [action.payload.emailGroupId]: {
            status: 'succeeded',
            emailGroup: { ...emailGroup, emails: updatedEmails },
          },
        };
      })
      .addCase(addNewEmailGroup.fulfilled, (state, action) => {
        return {
          ...state,
          [action.payload.id]: {
            status: 'succeeded',
            emailGroup: {
              ...action.payload,
            },
          },
        };
      });
  },
});

// TODO: rewrite with extrareducer
export const fetchDetailedEmailGroup = createAsyncThunk(
  'emailGroups/fetchDetailedEmailGroup',
  async (emailGroupId: string, thunkAPI) => {
    thunkAPI.dispatch(loading(emailGroupId));
    try {
      const response = await API.get(`/mailing-group/${emailGroupId}`);
      thunkAPI.dispatch(fulfilled({ emailGroup: response.data.group }));
    } catch (error) {
      thunkAPI.dispatch(rejected({ id: emailGroupId }));
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Fetching email group data error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const deleteEmailFromGroup = createAsyncThunk(
  'emailGroups/deleteEmailFromGroup',
  async (data: { emailGroupId: string; emailId: string }) => {
    try {
      await API.patch(`/mailing-group/${data.emailGroupId}/emails/delete`, {
        email_ids: [data.emailId],
      });
      return data;
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Deleting email error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const updateEmailValue = createAsyncThunk(
  'emailGroups/updateEmailValue',
  async (
    data: { emailGroupId: string; emailId: string; emailValue: string },
    thunkAPI
  ) => {
    try {
      const response = await API.patch(
        `/mailing-group/${data.emailGroupId}/email/${data.emailId}`,
        {
          email: data.emailValue,
        }
      );
      thunkAPI.dispatch(fulfilled({ emailGroup: response.data.group }));
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Updating email error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const addEmailToGroup = createAsyncThunk(
  'emailGroups/addEmailToGroup',
  async (data: { groupId: string; email: string }, thunkAPI) => {
    try {
      const response = await API.patch(
        `/mailing-group/${data.groupId}/emails/add`,
        {
          emails: [
            {
              email: data.email,
            },
          ],
        }
      );
      thunkAPI.dispatch(fulfilled({ emailGroup: response.data.group }));
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Adding new email error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const changeEmailGroupName = createAsyncThunk(
  'emailGroups/changeEmailGroupName',
  async (data: { groupId: string; name: string }, thunkAPI) => {
    try {
      await API.patch(`/mailing-group/${data.groupId}`, {
        name: data.name,
      });
      thunkAPI.dispatch(changedName(data));
      thunkAPI.dispatch(changeNameInCommonGroups(data));
    } catch (error) {
      const baseError = error as BaseError;
      const errorStatus = baseError?.response.status;
      const errorMessage = `Changing email group error
          ${errorStatus ? `Status: ${errorStatus};` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const addNewEmailGroup = createAsyncThunk(
  'emailGroups/addNewEmailGroup',
  async (data: {
    emailGroupName: string;
    emails: Array<{ email: string }>;
  }) => {
    try {
      const response = await API.post('/mailing-group', {
        emails: data.emails,
        name: data.emailGroupName,
      });
      return response.data.group;
    } catch (error) {
      const baseError = error as BaseError;
      const errorDetail = baseError?.response?.data?.detail;
      const errorMessage = `Adding email group error
          ${errorDetail ? `Details: ${errorDetail}` : ''}`;

      toast.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }
);

export const getDetailedEmailGroupById = (state: RootState) =>
  state.emailGroupsDetailedData;

const { loading, fulfilled, rejected, changedName } =
  emailGroupsDetailedSlice.actions;

export default emailGroupsDetailedSlice.reducer;
