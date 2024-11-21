import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { EmailAsset, getEmailAssetById } from '../../slices/emailAssets';
import { AppDispatch } from '../../misc/store';

export const useEmailAssetsModalData = () => {
  const [editingEmailAsset, setEditingEmailAsset] = useState<
    EmailAsset | undefined
  >();
  const [isEmailAssetDialogOpen, setIsEmailAssetDialogOpen] = useState(false);
  const closeNewAssetDialog = useCallback(() => {
    setEditingEmailAsset(undefined);
    setIsEmailAssetDialogOpen(false);
  }, []);

  const openEmailAssetDialogWithData = useCallback((data: EmailAsset) => {
    setEditingEmailAsset(data);
    setIsEmailAssetDialogOpen(true);
  }, []);

  const openEmailAssetDialog = useCallback(() => {
    setIsEmailAssetDialogOpen(true);
  }, []);

  return {
    editingEmailAsset,
    isEmailAssetDialogOpen,
    closeNewAssetDialog,
    openEmailAssetDialog,
    openEmailAssetDialogWithData,
  };
};

export const useHandleEditAssetData = (
  editAssetData: EmailAsset | undefined,
  setEmailAssetContentLoading: Dispatch<SetStateAction<boolean>>,
  setAssetContent: Dispatch<SetStateAction<string>>,
  setAssetName: Dispatch<SetStateAction<string>>,
  setAssetSubject: Dispatch<SetStateAction<string>>
) => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!editAssetData) return;

    const getAndSetEmailAssetContent = async () => {
      setEmailAssetContentLoading(true);
      const emailAssetData = await dispatch(
        getEmailAssetById(editAssetData.id)
      );
      setEmailAssetContentLoading(false);
      setAssetContent((emailAssetData.payload as EmailAsset).content ?? '');
    };

    setAssetName(editAssetData.name);
    setAssetSubject(editAssetData.subject);
    if (editAssetData.content) {
      setAssetContent(editAssetData.content);
    } else {
      getAndSetEmailAssetContent();
    }
  }, [editAssetData]);
};
