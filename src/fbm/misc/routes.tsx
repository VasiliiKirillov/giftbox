import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { store } from './store';
import { fetchCampaigns } from '../slices/campaigns';
import { fetchEmailAssets } from '../slices/emailAssets';
import { fetchEmailGroups } from '../slices/emailGroups';
import { Root } from '../pages/Root/Root.page';
import { ErrorPage } from '../pages/Error/Error.page';
import { Home } from '../pages/Home/Home.page';
import { MyCampaigns } from '../pages/MyCampaigns/MyCampaigns.page';
import { MyEmailGroups } from '../pages/MyEmailGroups/MyEmailGroups.page';
import { MyAssets } from '../pages/MyAssets/MyAssets.page';
import { EmailGroupDetailedPage } from '../pages/EmailGroupDetailed/EmailGroupDetailed.page';
import { fetchDetailedEmailGroup } from '../slices/emailGroupsDetailed';
import { UnsavedEmailGroupPage } from '../pages/UnsavedEmailGroup/UnsavedEmailGroup.page';
import { CalculatorPage } from '../pages/Calculator.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: () => {
      store.dispatch(fetchCampaigns());
      store.dispatch(fetchEmailAssets());
      store.dispatch(fetchEmailGroups());

      return null;
    },
    children: [
      {
        path: '/',
        element: <CalculatorPage />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/campaigns',
        element: <MyCampaigns />,
      },
      {
        path: '/emailgroups',
        element: <MyEmailGroups />,
      },
      {
        path: 'emailgroups/:emailGroupId',
        element: <EmailGroupDetailedPage />,
        loader: ({ params }) => {
          const state = store.getState();
          if (
            params.emailGroupId &&
            state.emailGroupsDetailedData[params.emailGroupId]?.status !==
              'succeeded'
          ) {
            store.dispatch(fetchDetailedEmailGroup(params.emailGroupId));
          }
          return null;
        },
      },
      {
        path: 'emailgroups/new',
        element: <UnsavedEmailGroupPage />,
      },
      {
        path: '/assets',
        element: <MyAssets />,
      },
    ],
  },
]);

export default router;
