import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPickedAsset } from '../../store/spreadsheetList';
import { fetchLimitOrderByCurrency } from '../../store/limitOrders';
import { useAppDispatch } from '../../store/store';

interface LimitOrderDetailsControllerProps {
  children: React.ReactNode;
}

export const LimitOrderDetailsController: React.FC<
  LimitOrderDetailsControllerProps
> = ({ children }) => {
  const pickedAsset = useSelector(getPickedAsset);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pickedAsset) {
      dispatch(fetchLimitOrderByCurrency(pickedAsset.name));
    }
  }, [pickedAsset]);

  return <>{children}</>;
};
