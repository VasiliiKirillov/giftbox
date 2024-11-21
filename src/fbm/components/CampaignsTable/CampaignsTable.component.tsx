import React, { FC, memo, ReactNode } from 'react';
import { H4 } from '@blueprintjs/core';

import classes from './CampaignsTable.module.css';

type CampaignsTableProps = {
  children: ReactNode;
};

export const CampaignsTable: FC<CampaignsTableProps> = memo(({ children }) => {
  return (
    <table className={`bp4-html-table ${classes.tableMain}`}>
      <thead>
        <tr>
          <th className={classes.firstCampaignsElement}>
            <div className={classes.thWrapper}>
              <H4>Name</H4>
            </div>
          </th>
          <th>
            <div className={classes.thWrapper}>
              <H4>State</H4>
            </div>
          </th>
          <th>
            <div className={classes.thWrapper}>
              <H4>Created At</H4>
            </div>
          </th>
          <th>
            <div className={classes.thWrapper}>
              <H4>Messages Sent</H4>
            </div>
          </th>
          <th>
            <div className={classes.thWrapper}>
              <H4>Total Messages</H4>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
});
