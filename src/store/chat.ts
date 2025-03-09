import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { addAccountingRecord } from './accountingRecord';

export type ChatMessage = {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: string;
  record?: string;
  amount?: number;
  type?: 'expense' | 'income';
  storage?: string;
  transactionMonth?: string;
  transactionYear?: string;
};

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [
    {
      id: 1,
      message: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ],
  isLoading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (userInput: string, thunkAPI) => {
    thunkAPI.dispatch(ChatSlice.actions.addUserMessage(userInput));

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/openai/chat`,
      {
        message: userInput,
      }
    );

    if (
      response.data.success &&
      response.data.response.transactionMonth &&
      response.data.response.transactionYear &&
      response.data.response.record &&
      response.data.response.amount &&
      response.data.response.type &&
      response.data.response.storage &&
      response.data.response.accountingRecordId
    ) {
      thunkAPI.dispatch(
        addAccountingRecord({
          ...response.data.response,
        })
      );
      return response.data;
    }

    return {
      ...response.data,
      success: false,
    };
  }
);

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = initialState.messages;
      state.error = null;
    },
    addUserMessage: (state, action) => {
      const userMessage: ChatMessage = {
        id: state.messages.length + 1,
        message: action.payload,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      state.messages.push(userMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        let message = '';
        if (action.payload.success) {
          message = `I've added a ${action.payload.response.type} transaction of ${action.payload.response.amount} for ${action.payload.response.record}`;
        } else {
          message =
            'Something went wrong. Please try again. Technical error: ' +
            action.payload.response.technicalMessage;
        }

        const aiMessage: ChatMessage = {
          id: state.messages.length + 1,
          transactionMonth: action.payload.response.transactionMonth,
          transactionYear: action.payload.response.transactionYear,
          record: action.payload.response.record,
          amount: action.payload.response.amount,
          storage: action.payload.response.storage,
          type: action.payload.response.type,
          message,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        state.messages.push(aiMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'An error occurred';
        // Add error message
        const errorMessage: ChatMessage = {
          id: state.messages.length + 1,
          message: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        state.messages.push(errorMessage);
      });
  },
});

export const { clearChat, addUserMessage } = ChatSlice.actions;
export default ChatSlice.reducer;

export const getIsLoading = (state: RootState) => state.chat.isLoading;
export const getMessages = (state: RootState) => state.chat.messages;
export const getLastMessage = (state: RootState) =>
  state.chat.messages[state.chat.messages.length - 1];
