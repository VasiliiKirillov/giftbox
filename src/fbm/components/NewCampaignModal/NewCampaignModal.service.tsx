import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { AppDispatch } from '../../misc/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  EmailAsset,
  getEmailAssetById,
  getEmailAssetsById,
} from '../../slices/emailAssets';

export const useNewCampaignModalData = () => {
  const [isNewCampaignDialogOpen, setIsNewCampaignDialogOpen] = useState(false);

  const closeNewCampaignDialog = useCallback(() => {
    setIsNewCampaignDialogOpen(false);
  }, []);

  const openNewCampaignDialog = useCallback(() => {
    setIsNewCampaignDialogOpen(true);
  }, []);

  return {
    isNewCampaignDialogOpen,
    closeNewCampaignDialog,
    openNewCampaignDialog,
  };
};

export const useHandlePickingEmailAsset = (
  emailAssetId: string | null,
  setCampaignSubject: Dispatch<SetStateAction<string>>,
  setCampaignContent: Dispatch<SetStateAction<string>>,
  setEmailAssetContentLoading: Dispatch<SetStateAction<boolean>>
) => {
  const dispatch: AppDispatch = useDispatch();

  const emailAssetsById = useSelector(getEmailAssetsById);

  useEffect(() => {
    if (!emailAssetId) return;

    const emailAsset = emailAssetsById[emailAssetId];
    setCampaignSubject(emailAsset.subject);

    if (emailAsset.content) {
      setCampaignContent(emailAsset.content);
    } else {
      const getAndSetEmailAssetContent = async () => {
        setEmailAssetContentLoading(true);
        const emailAssetData = await dispatch(getEmailAssetById(emailAssetId));
        setEmailAssetContentLoading(false);
        setCampaignContent(
          (emailAssetData.payload as EmailAsset).content ?? ''
        );
      };
      getAndSetEmailAssetContent();
    }
  }, [emailAssetId]);
};
