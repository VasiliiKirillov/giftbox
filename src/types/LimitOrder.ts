export interface CurrentLimitOrder {
  currencyPrice: string;
  assetsQuantity: string;
  orderValue: string;
  orderType: 'BUY' | 'SELL';
}

export interface LimitOrder {
  id: number;
  currencyName: string;
  currencyPrice: number;
  assetsQuantity: number;
  orderType: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  desirableAssetsPercent: number;
  orderValue: number;
  createdAt: string;
  updatedAt: string;
}
