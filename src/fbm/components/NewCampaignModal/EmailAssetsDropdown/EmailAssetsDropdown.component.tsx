import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { EmailAsset, getEmailAssets } from '../../../slices/emailAssets';
import { Dropdown } from '../../Dropdown/Dropdown.component';

type EmailAssetsDropdownProps = {
  handlePickedEmailAssetId: Dispatch<SetStateAction<string | null>>;
};

export const EmailAssetsDropdown: FC<EmailAssetsDropdownProps> = ({
  handlePickedEmailAssetId,
}) => {
  const [pickedEmailAssetName, setPickedEmailAssetName] = useState('...');

  const emailAssets = useSelector(getEmailAssets);

  const handlePickedElement = useCallback((emailAsset: EmailAsset) => {
    setPickedEmailAssetName(emailAsset.name);
    handlePickedEmailAssetId(emailAsset.id);
  }, []);

  return (
    <Dropdown
      elements={emailAssets}
      handlePickedElement={handlePickedElement}
      pickedElementName={pickedEmailAssetName}
      disabled={emailAssets.length === 0}
    />
  );
};
