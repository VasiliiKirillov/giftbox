import React from 'react';
import { useSelector } from 'react-redux';

import {
  getEmailAssetsStatus,
  getIsEmailAssetsEmpty,
} from '../../../slices/emailAssets';
import LoadingErrorPlaceholder from './LoadingErrorPlaceholder/LoadingErrorPlaceholder.component';
import EmptyPlaceholder from './EmptyPlaceholder/EmptyPlaceholder.component';

const Placeholders = () => {
  const emailAssetsStatus = useSelector(getEmailAssetsStatus);
  const isEmailAssetsEmpty = useSelector(getIsEmailAssetsEmpty);

  const isShowLoadingErrorPlaceholder = emailAssetsStatus === 'failed';

  return (
    <>
      {isShowLoadingErrorPlaceholder && <LoadingErrorPlaceholder />}
      {isEmailAssetsEmpty && <EmptyPlaceholder />}
    </>
  );
};

export default Placeholders;
