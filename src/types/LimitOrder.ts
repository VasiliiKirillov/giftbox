export interface LimitOrder {
  currencyPrice: string;
  assetsQuantity: string;
  orderValue: string;
  orderType: 'BUY' | 'SELL';
}
