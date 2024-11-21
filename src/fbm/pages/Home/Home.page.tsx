import React, { memo } from 'react';

import classes from './Home.module.css';
import { HomeCampaigns } from '../../modules/HomeCampaigns/HomeCampaigns.module';
import { HomeEmailGroups } from '../../modules/HomeEmailGroups/HomeEmailGroups.module';
import { HomeEmailAssets } from '../../modules/HomeEmailAssets/HomeEmailAssets.module';

export const Home = memo(() => {
  return (
    <>
      <HomeCampaigns />
      <div className={classes.homeEntitiesWrapper}>
        <div className={classes.entityWrapper}>
          <HomeEmailGroups />
        </div>
        <div className={classes.entityWrapper}>
          <HomeEmailAssets />
        </div>
      </div>
    </>
  );
});
