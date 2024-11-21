import React, { FC, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EditableText, H4, Spinner } from '@blueprintjs/core';

import commonClasses from '../../../misc/common.module.css';
import classes from '../EmailGroupDetailed.module.css';
import { AppDispatch } from '../../../misc/store';
import {
  changeEmailGroupName,
  EmailGroupDetailed,
} from '../../../slices/emailGroupsDetailed';

type EmailGroupNameProps = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  emailGroup: EmailGroupDetailed;
};

export const EmailGroupName: FC<EmailGroupNameProps> = ({
  status,
  emailGroup,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const [emailGroupName, setEmailGroupName] = useState('');
  const [isShowNameLoader, setIsShowNameLoader] = useState(false);

  const isLoading = status === 'loading';
  const isSucceeded = status === 'succeeded';

  useLayoutEffect(() => {
    if (!isSucceeded) return;

    setEmailGroupName(emailGroup.name);
  }, [isSucceeded]);

  const handleNameConfirmation = async (groupName: string) => {
    if (groupName === emailGroup?.name) return;

    setIsShowNameLoader(true);
    await dispatch(
      changeEmailGroupName({
        groupId: emailGroup.id,
        name: groupName,
      })
    );
    setIsShowNameLoader(false);
  };

  return (
    <div className={commonClasses.flexRow}>
      <H4>Email group name: </H4>
      <H4>
        <EditableText
          className={`${isLoading ? 'bp4-skeleton' : ''}`}
          placeholder="..."
          maxLength={40}
          onChange={(e) => {
            setEmailGroupName(e);
          }}
          onConfirm={handleNameConfirmation}
          value={emailGroupName}
        />
      </H4>
      {isShowNameLoader && (
        <div className={classes.marginButton}>
          <Spinner size={24} />
        </div>
      )}
    </div>
  );
};
