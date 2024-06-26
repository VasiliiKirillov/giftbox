import { memo } from 'react';
import { AppDispatch } from '../store/store';
import { useDispatch } from 'react-redux';
import { addFirstStorage } from '../store/storagesState';
import { NewStorage } from '../components/NewStorage';

export const FirstStoragePage = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const handleAddFirstStorage = (
    currency: CurrencyKey,
    storageName: string,
    storageAmount: number
  ) => {
    dispatch(
      addFirstStorage({
        currency,
        storageName,
        storageAmount,
      })
    );
  };

  return (
    <>
      <div>A new user here! Add your first storage to continue:</div>
      <NewStorage onAddNewStorage={handleAddFirstStorage} />
    </>
  );
});
