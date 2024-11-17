import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppNew } from '../pages/AppNew';

export const routerNew = createBrowserRouter([
  {
    path: '',
    element: <AppNew />,
  },
]);
