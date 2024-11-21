import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { FocusStyleManager } from '@blueprintjs/core';

import './index.css';
import router from './misc/routes';
import { store } from './misc/store';
import { handleDarkMode } from './misc/utils';
import CommonModalHOC from './containers/CommonModal/CommonModal.HOC';

FocusStyleManager.onlyShowFocusOnTabs();

handleDarkMode(
  () => {
    document.body.classList.add('bp4-dark');
  },
  () => {
    document.body.classList.remove('bp4-dark');
  }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <ToastContainer />
    <CommonModalHOC>
      <RouterProvider router={router} />
    </CommonModalHOC>
  </Provider>
);
