import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCurrencyData } from '../../store/spreadsheetList';
import { fetchLimitOrderByCurrency } from '../../store/limitOrders';
import { useAppDispatch } from '../../store/store';

interface LimitOrderDetailsControllerProps {
  children: React.ReactNode;
}

export const LimitOrderDetailsController: React.FC<
  LimitOrderDetailsControllerProps
> = ({ children }) => {
  const currencyData = useSelector(getCurrencyData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currencyData) {
      dispatch(fetchLimitOrderByCurrency(currencyData.name));
    }
  }, [currencyData]);

  return <>{children}</>;
};
