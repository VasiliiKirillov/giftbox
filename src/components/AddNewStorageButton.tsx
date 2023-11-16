import { memo, useState } from 'react';
import styled from 'styled-components';
import { NewStorage } from './NewStorage';
import { AppDispatch } from '../store/store';
import { useDispatch } from 'react-redux';
import { addNewStorage } from '../store/storagesState';

export const AddNewStorageButton = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const [isNewStorageModalShow, setIsNewStorageModalShow] = useState(false);

  const handleAddNewStorage = async (
    currency: CurrencyKey,
    storageName: string,
    storageAmount: number
  ) => {
    await dispatch(
      addNewStorage({
        currency,
        storageName,
        storageAmount,
      })
    );
    setIsNewStorageModalShow(false);
  };

  return (
    <>
      {isNewStorageModalShow && (
        <AddNewStorageModal>
          <CloseButtonStyled onClick={() => setIsNewStorageModalShow(false)}>
            Close
          </CloseButtonStyled>
          <NewStorage onAddNewStorage={handleAddNewStorage} />
        </AddNewStorageModal>
      )}
      <AddNewStorageButtonStyled onClick={() => setIsNewStorageModalShow(true)}>
        Add new storage
      </AddNewStorageButtonStyled>
    </>
  );
});

// styles
const AddNewStorageButtonStyled = styled.div`
  display: flex;
  cursor: pointer;
`;

const CloseButtonStyled = styled.div`
  cursor: pointer;
`;

const AddNewStorageModal = styled.div`
  position: fixed;
  background-color: white;
  top: 20vh;
  left: 29vw;
`;
