import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../store/store';
import {
  sendMessage,
  getIsLoading,
  getMessages,
  getLastMessage,
} from '../../store/chat';
import { useSelector } from 'react-redux';
import { fetchAllStorages, getStoragesByName } from '../../store/storage';
import { addNewTransaction } from '../../store/utils';
import { getPickedSpreadsheet } from '../../store/spreadsheetList';

const useUpdateSpreadsheetList = () => {
  const storagesByName = useSelector(getStoragesByName);
  const lastMessage = useSelector(getLastMessage);
  const pickedSpreadsheet = useSelector(getPickedSpreadsheet);

  useEffect(() => {
    const lastMessageCorrect =
      !lastMessage.isUser &&
      lastMessage.storage &&
      lastMessage.amount &&
      lastMessage.record &&
      lastMessage.type;
    if (lastMessageCorrect && pickedSpreadsheet) {
      addNewTransaction(
        localStorage.getItem('spreadsheetId') ?? '',
        pickedSpreadsheet.name,
        storagesByName[lastMessage.storage as string].metaData,
        lastMessage.type === 'expense'
          ? `-${lastMessage.amount!.toString()}`
          : lastMessage.amount!.toString(),
        lastMessage.record!
      )
        .then(() => {
          console.log('gov Transaction added');
        })
        .catch((error) => {
          console.error('gov Error adding transaction:', error);
        });
    }
  }, [lastMessage.id, pickedSpreadsheet]);
};
export const ChatWithAI = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();
  const isLoading = useSelector(getIsLoading);
  const messages = useSelector(getMessages);

  useUpdateSpreadsheetList();

  useEffect(() => {
    dispatch(fetchAllStorages());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    dispatch(sendMessage(inputValue));
    setInputValue('');
  };

  return (
    <ChatContainer>
      <ChatHistory>
        {messages.map((message) => (
          <MessageContainer key={message.id} isUser={message.isUser}>
            <Message isUser={message.isUser}>
              <MessageText>{message.message}</MessageText>
              <MessageTime>{message.timestamp}</MessageTime>
            </Message>
          </MessageContainer>
        ))}
        {isLoading && (
          <MessageContainer isUser={false}>
            <Message isUser={false}>
              <MessageText>Thinking...</MessageText>
            </Message>
          </MessageContainer>
        )}
      </ChatHistory>
      <InputForm onSubmit={handleSubmit}>
        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </SendButton>
      </InputForm>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const ChatHistory = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const Message = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${(props) => (props.isUser ? '#007AFF' : '#F0F0F0')};
  color: ${(props) => (props.isUser ? '#ffffff' : '#000000')};
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const MessageTime = styled.span`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
`;

const InputForm = styled.form`
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #007aff;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;
