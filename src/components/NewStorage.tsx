import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import { Dropdown } from './Dropdown';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAvailableCurrencies,
  getCurrenciesList,
} from '../store/availableCurrencies';
import { AppDispatch } from '../store/store';
import { getStoragesById } from '../store/storagesState';
import { generateStorageId } from '../utils/main';

type CurrencyItem = { name: string; id: CurrencyKey };

type NewStorageProps = {
  onAddNewStorage: (
    currency: CurrencyKey,
    storageName: string,
    storageAmount: number
  ) => void;
};

export const NewStorage: FC<NewStorageProps> = memo(({ onAddNewStorage }) => {
  const dispatch: AppDispatch = useDispatch();

  const currencies = useSelector(getCurrenciesList);
  const storagesById = useSelector(getStoragesById);

  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, []);

  const [pickedCurrency, setPickedCurrency] = useState<CurrencyItem | null>(
    null
  );
  const [storageName, setStorageName] = useState('');
  const [storageAmount, setStorageAmount] = useState('');

  const [isShowSameStorageError, setIsShowSameStorageError] = useState(false);

  const handleAddNewStorage = () => {
    const parsedStorageAmount = Number(storageAmount);

    const isSameStorageAlreadyExisted =
      storagesById[generateStorageId(storageName, pickedCurrency?.id ?? '')];
    if (isSameStorageAlreadyExisted) {
      setIsShowSameStorageError(true);
    }

    if (
      !pickedCurrency ||
      isNaN(parsedStorageAmount) ||
      storageName === '' ||
      isSameStorageAlreadyExisted
    )
      return;

    onAddNewStorage(pickedCurrency.id, storageName, parsedStorageAmount);
  };

  const handleSetStorageName = (e: ChangeEvent<HTMLInputElement>) => {
    if (isShowSameStorageError) {
      setIsShowSameStorageError(false);
    }
    setStorageName(e.currentTarget.value);
  };

  return (
    <NewStorageStyled>
      <Dropdown
        setPickedElement={setPickedCurrency}
        pickedElement={pickedCurrency}
        placeholderValue={'Pick Currency'}
        listData={currencies}
      />
      <StorageDataStyled>
        <NewStorageInput
          onChange={handleSetStorageName}
          placeholder="enter storage name"
          value={storageName}
        />
        <NewStorageContainer>
          <NewStorageInput
            onChange={(e) => setStorageAmount(e.currentTarget.value)}
            placeholder="enter storage amount"
            value={storageAmount}
          />
        </NewStorageContainer>
      </StorageDataStyled>
      <FootterNewStorageStyled>
        <AddNewStorageStyled onClick={handleAddNewStorage}>
          Add
        </AddNewStorageStyled>
        {isShowSameStorageError && (
          <ErrorNewStorageStyled>
            You're trying to add storage with the same name!
          </ErrorNewStorageStyled>
        )}
      </FootterNewStorageStyled>
    </NewStorageStyled>
  );
});

// styles
const NewStorageStyled = styled.div`
  display: flex;
  flex-direction: column;
  border: solid;
  width: 512px;
  height: 254px;
  padding: 16px;
  justify-content: space-between;
`;

const AddNewStorageStyled = styled.div`
  cursor: pointer;
`;

const ErrorNewStorageStyled = styled.div`
  color: red;
`;

const FootterNewStorageStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const StorageDataStyled = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 24px;
  justify-content: space-between;
`;

const NewStorageInput = styled.input`
  background: rgb(233, 233, 233);
  height: 32px;
  padding: 8px;
  font-size: 16px;
  color: #1b1b1b;
  border: none;
`;

const NewStorageContainer = styled.div`
  width: 200px;
`;
