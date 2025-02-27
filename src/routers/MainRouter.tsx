import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { App } from '../pages/App';
import { MainPage } from '../pages/MainPage';
import { Calculator } from '../components/Calculator/Calculator';
import { ChatWithAI } from '../components/ChatWithAI/ChatWithAI';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <MainPage />,
        children: [
          {
            path: 'calculator',
            element: <Calculator />,
          },
          {
            path: '',
            element: <ChatWithAI />,
          },
        ],
      },
    ],
  },
]);
