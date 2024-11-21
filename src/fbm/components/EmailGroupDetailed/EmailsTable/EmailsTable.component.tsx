import React, { FC, memo, ReactNode } from 'react';
import classes from './EmailsTable.module.css';

type CampaignsTableProps = {
  children: ReactNode;
  isLoading: boolean;
};

export const EmailsTable: FC<CampaignsTableProps> = memo(
  ({ children, isLoading }) => {
    return (
      <table
        className={`bp4-html-table bp4-compact ${
          isLoading ? '' : 'bp4-html-table-striped'
        } ${classes.tableMain}`}
      >
        <thead>
          <tr>
            <th style={{ width: '350px' }}>Email</th>
            <th style={{ width: '350px' }}>Status</th>
            <th style={{ width: '120px' }}></th>
            <th style={{ width: '120px' }}></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    );
  }
);
