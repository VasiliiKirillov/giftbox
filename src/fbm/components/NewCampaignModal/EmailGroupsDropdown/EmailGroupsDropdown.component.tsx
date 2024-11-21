import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { getEmailGroups } from '../../../slices/emailGroups';
import { EmailGroup } from '../../../slices/emailGroupsDetailed';
import { Dropdown } from '../../Dropdown/Dropdown.component';

type EmailGroupsDropdownProps = {
  handlePickedEmailGroupId: (emailGroupId: string) => void;
};

export const EmailGroupsDropdown: FC<EmailGroupsDropdownProps> = ({
  handlePickedEmailGroupId,
}) => {
  const [pickedEmailGroupName, setPickedEmailGroupName] = useState('...');

  const emailGroups = useSelector(getEmailGroups);

  const handlePickedElement = useCallback((emailGroup: EmailGroup) => {
    handlePickedEmailGroupId(emailGroup.id);
    setPickedEmailGroupName(emailGroup.name);
  }, []);

  return (
    <Dropdown
      elements={emailGroups}
      handlePickedElement={handlePickedElement}
      pickedElementName={pickedEmailGroupName}
    />
  );
};
