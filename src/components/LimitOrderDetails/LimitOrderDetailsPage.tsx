import React from 'react';
import { LimitOrderDetails } from './LimitOrderDetails';
import { LimitOrderDetailsController } from './LimitOrderDetailsController';

export const LimitOrderDetailsPage: React.FC = () => {
  return (
    <LimitOrderDetailsController>
      <LimitOrderDetails />
    </LimitOrderDetailsController>
  );
};
