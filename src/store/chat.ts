import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export type ChatMessage = {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: string;
  metadata?: {
    category: string;
    amount: number;
    type: 'expense' | 'income';
  };
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
      'https://giftbox-backend-5d90.onrender.com/openai/chat',
      {
        message: userInput,
      }
    );
    // Extract the response text or stringify the object for display
    const { message, ...metadata } = response.data.response;
    return {
      metadata,
      message,
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
        // Add AI response
        const aiMessage: ChatMessage = {
          id: state.messages.length + 1,
          message: action.payload.message,
          metadata: action.payload.metadata,
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
