import React from 'react';
import { useSelector } from 'react-redux';

import {
  getEmailGroupsStatus,
  getIsEmailGroupsEmpty,
} from '../../../slices/emailGroups';
import LoadingErrorPlaceholder from './LoadingErrorPlaceholder/LoadingErrorPlaceholder.component';
import EmptyPlaceholder from './EmptyPlaceholder/EmptyPlaceholder.component';

const Placeholders = () => {
  const emailGroupsStatus = useSelector(getEmailGroupsStatus);
  const isEmailGroupsEmpty = useSelector(getIsEmailGroupsEmpty);

  const isShowLoadingErrorPlaceholder = emailGroupsStatus === 'failed';

  return (
    <>
      {isShowLoadingErrorPlaceholder && <LoadingErrorPlaceholder />}
      {isEmailGroupsEmpty && <EmptyPlaceholder />}
    </>
  );
};

export default Placeholders;
