import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { addNewTransaction } from './utils';
import { getSpreadsheetList } from './spreadsheetList';

export type ChatMessage = {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: string;
  record?: string;
  amount?: number;
  type?: 'expense' | 'income';
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
    const state = thunkAPI.getState() as RootState;
    const spreadsheetList = getSpreadsheetList(state);

    thunkAPI.dispatch(ChatSlice.actions.addUserMessage(userInput));

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/openai/chat`,
      {
        message: userInput,
        spreadsheetName: spreadsheetList[0].name,
      }
    );
    return {
      ...response.data,
      spreadsheetName: spreadsheetList[0].name,
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

        console.log(action.payload);
        let message = '';
        if (
          action.payload.success &&
          action.payload.response.transactionMonth &&
          action.payload.response.transactionYear &&
          action.payload.response.record &&
          action.payload.response.amount &&
          action.payload.response.type
        ) {
          message = `I've added a ${action.payload.response.type} transaction of ${action.payload.response.amount} for ${action.payload.response.record}`;
          addNewTransaction(
            localStorage.getItem('spreadsheetId') ?? '',
            action.payload.spreadsheetName,
            'A20:B',
            action.payload.response.type === 'expense'
              ? `-${action.payload.response.amount}`
              : action.payload.response.amount,
            action.payload.response.record
          ).then(() => {
            console.log('gov Transaction added');
          });
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
