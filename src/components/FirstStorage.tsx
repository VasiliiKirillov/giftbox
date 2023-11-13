import { memo, useState } from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';
import { AppDispatch } from '../store/store';
import { useDispatch } from 'react-redux';
import { addFirstStorage } from '../store/storagesState';

const currencies = [{ name: 'RUB', id: '1' }];

export const FirstStorage = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const [pickedCurrency, setPickedCurrency] = useState<CurrencyType | null>(
    null
  );
  const [storageName, setStorageName] = useState('');
  const [storageAmount, setStorageAmount] = useState('');

  const handleAddFirstStorage = () => {
    const parsedStorageAmount = Number(storageAmount);

    if (!pickedCurrency || isNaN(parsedStorageAmount) || storageName === '')
      return;

    dispatch(
      addFirstStorage({
        pickedCurrency,
        storageName,
        storageAmount: parsedStorageAmount,
      })
    );
  };

  return (
    <>
      A new user here! Add your first storage to continue:
      <FirstStorageStyled>
        <Dropdown
          setPickedElement={setPickedCurrency}
          pickedElement={pickedCurrency}
          placeholderValue={'Pick Currency'}
          listData={currencies}
        />
        <StorageDataStyled>
          <FirstStorageInput
            onChange={(e) => setStorageName(e.currentTarget.value)}
            placeholder="enter storage name"
            value={storageName}
          />
          <FirstStorageContainer>
            <FirstStorageInput
              onChange={(e) => setStorageAmount(e.currentTarget.value)}
              placeholder="enter storage amount"
              value={storageAmount}
            />
          </FirstStorageContainer>
        </StorageDataStyled>
        <AddFirstStorageStyled onClick={handleAddFirstStorage}>
          Add
        </AddFirstStorageStyled>
      </FirstStorageStyled>
    </>
  );
});

// styles
const FirstStorageStyled = styled.div`
  display: flex;
  flex-direction: column;
  border: solid;
  width: 512px;
  height: 254px;
  padding: 16px;
  justify-content: space-between;
`;

const AddFirstStorageStyled = styled.div`
  cursor: pointer;
`;

const StorageDataStyled = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 24px;
  justify-content: space-between;
`;

const FirstStorageInput = styled.input`
  background: rgb(233, 233, 233);
  height: 32px;
  padding: 8px;
  font-size: 16px;
  color: #1b1b1b;
  border: none;
`;

const FirstStorageContainer = styled.div`
  width: 200px;
`;
