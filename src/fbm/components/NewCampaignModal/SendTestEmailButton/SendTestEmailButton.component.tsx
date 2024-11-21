import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from '@blueprintjs/core';

import classes from './SendTestEmailButton.module.css';
import { AppDispatch } from '../../../misc/store';
import { sendTestEmail } from '../../../slices/campaigns';

type SendTestEmailButtonProps = {
  campaignSubject: string;
  campaignContent: string;
};

export const SendTestEmailButton: FC<SendTestEmailButtonProps> = ({
  campaignSubject,
  campaignContent,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  const isSendEmailButtonDisabled =
    campaignSubject.length === 0 ||
    campaignContent.length === 0 ||
    isSendingTestEmail;

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    await dispatch(sendTestEmail({ campaignSubject, campaignContent }));
    setIsSendingTestEmail(false);
  };

  return (
    <div className={classes.sendTestEmailButtonContainer}>
      <Button
        intent="primary"
        text="Send me test email"
        disabled={isSendEmailButtonDisabled}
        onClick={handleSendTestEmail}
      />
      {isSendingTestEmail && <Spinner size={24} />}
    </div>
  );
};
