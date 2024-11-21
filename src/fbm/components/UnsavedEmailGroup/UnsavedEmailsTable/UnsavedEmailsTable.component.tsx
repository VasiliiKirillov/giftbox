import React, { FC, memo, ReactNode } from 'react';
import classes from './UnsavedEmailsTable.module.css';

type CampaignsTableProps = {
  children: ReactNode;
};

export const UnsavedEmailsTable: FC<CampaignsTableProps> = memo(
  ({ children }) => {
    return (
      <table className={`bp4-html-table bp4-compact ${classes.tableMain}`}>
        <thead>
          <tr>
            <th style={{ width: '700px' }}>Email</th>
            <th style={{ width: '120px' }}></th>
            <th style={{ width: '120px' }}></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    );
  }
);
