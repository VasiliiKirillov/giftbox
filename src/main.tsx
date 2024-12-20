import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import { store } from './store/store';
import './utils/api';
import { RouterProvider } from 'react-router-dom';
import { routerNew } from './routers/MainRouterNew';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={routerNew} />
  </Provider>
);
