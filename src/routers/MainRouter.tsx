import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AuthorizedApp } from '../pages/AuthorizedApp';
import { AuthPage } from '../pages/Auth.page';
import { App } from '../pages/App';
import { MainViewPage } from '../pages/MainView.page';
import { FirstStoragePage } from '../pages/FirstStorage.page';
import { CalculatorPage } from '../pages/Calculator.page';

export const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '',
        element: <AuthorizedApp />,
        children: [
          {
            path: '',
            element: <MainViewPage />,
          },
          {
            path: '/first-storage',
            element: <FirstStoragePage />,
          },
          {
            path: '/calculator',
            element: <CalculatorPage />,
          },
        ],
      },
      {
        path: '/login',
        element: <AuthPage />,
      },
    ],
  },
]);
