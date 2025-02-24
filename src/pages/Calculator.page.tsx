import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { InitialData } from '../components/Calculator/InitialData';
import { ThresholdBlock } from '../components/ThresholdBlock';
import Decimal from 'decimal.js';
import { CurrencyTitle } from '../components/Calculator/CurrencyTitle';
import { PieChart } from '../components/Calculator/PieChart';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrencyData, getTotalAmount } from '../store/spreadsheetList';
import { addLimitOrder } from '../store/limitOrders';

function calculateMultiplier(
  isAbove: boolean,
  desiredCurrencyRate: Decimal,
  currentAssetsCurrencyRate: string
) {
  const multiplier = desiredCurrencyRate
    .minus(currentAssetsCurrencyRate)
    .dividedBy(currentAssetsCurrencyRate)
    .times(100)
    .toDecimalPlaces(1);
  if (isAbove && multiplier.lt(0)) return 0;
  else if (!isAbove && multiplier.gt(0)) return 0;
  return multiplier;
}

function calculateOrderDetails(
  idealAssetsPercent: string,
  thresholdDeltaPercent: string,
  totalAmount: string,
  assetsInUSD: Decimal,
  assetsAmount: string,
  currentAssetsCurrencyRate: string,
  isAbove: boolean,
  averagePurchasePrice: string,
  isUseAveragePurchasePrice: boolean
) {
  const thresholdPercent = isAbove
    ? new Decimal(idealAssetsPercent).plus(thresholdDeltaPercent)
    : new Decimal(idealAssetsPercent).minus(thresholdDeltaPercent);
  const thresholdRatio = thresholdPercent.dividedBy(100);
  const desiredAssets = new Decimal(totalAmount)
    .minus(assetsInUSD)
    .times(thresholdRatio)
    .dividedBy(new Decimal(1).minus(thresholdRatio));

  const desiredCurrencyRate = desiredAssets
    .dividedBy(assetsAmount)
    .toDecimalPlaces(6);
  const orderPrice = new Decimal(
    desiredAssets.plus(totalAmount).minus(assetsInUSD)
  )
    .dividedBy(100)
    .times(thresholdDeltaPercent)
    .toDecimalPlaces(6);
  const orderAmount = orderPrice
    .dividedBy(desiredCurrencyRate)
    .toDecimalPlaces(6);

  const multiplier = calculateMultiplier(
    isAbove,
    desiredCurrencyRate,
    isUseAveragePurchasePrice && averagePurchasePrice
      ? averagePurchasePrice
      : currentAssetsCurrencyRate
  );

  return {
    desiredCurrencyRate: desiredCurrencyRate.toString(),
    orderPrice: orderPrice.toString(),
    orderAmount: orderAmount.toString(),
    multiplier: multiplier.toString(),
  };
}

export const CalculatorPage = memo(() => {
  const dispatch = useDispatch();
  const currencyData = useSelector(getCurrencyData);
  const totalAmountFromSpreadsheet = useSelector(getTotalAmount);

  useEffect(() => {
    if (!currencyData) return;
    setAssetsCurrencyName(currencyData.name.toUpperCase());
    setAssetsAmount(currencyData.amount);
    setCurrentAssetsCurrencyRate(currencyData.currencyRate);
    setIdealAssetsPercent(currencyData.desirablePercent);
    setBelowThresholdDeltaPercent(currencyData.belowThreshold);
    setAboveThresholdDeltaPercent(currencyData.aboveThreshold);
    if (!totalAmountFromSpreadsheet) return;
    setTotalAmount(totalAmountFromSpreadsheet);
  }, [currencyData, totalAmountFromSpreadsheet]);

  const [baseCurrencyName, setBaseCurrencyName] = useState('USD'); // usd
  const [assetsCurrencyName, setAssetsCurrencyName] = useState('BTC'); // crypto
  const [averagePurchasePrice, setAveragePurchasePrice] = useState(''); // crypto

  // set by user
  const [totalAmount, setTotalAmount] = useState('100'); // usd
  const [assetsAmount, setAssetsAmount] = useState('10'); // crypto
  const [currentAssetsCurrencyRate, setCurrentAssetsCurrencyRate] =
    useState('1'); // usd
  const [idealAssetsPercent, setIdealAssetsPercent] = useState('10'); // percent
  const [aboveThresholdDeltaPercent, setAboveThresholdDeltaPercent] =
    useState('5');
  const [belowThresholdDeltaPercent, setBelowThresholdDeltaPercent] =
    useState('5');
  // calculated
  const [aboveDesiredCurrencyRate, setAboveDesiredCurrencyRate] = useState('0');
  const [aboveOrderPrice, setAboveOrderPrice] = useState('0');
  const [aboveOrderAmount, setAboveOrderAmount] = useState('0');
  // add below states
  const [belowDesiredCurrencyRate, setBelowDesiredCurrencyRate] = useState('0');
  const [belowOrderPrice, setBelowOrderPrice] = useState('0');
  const [belowOrderAmount, setBelowOrderAmount] = useState('0');

  const [assetsInUsd, setAssetsInUsd] = useState('0');
  const [actualAssetsPercent, setActualAssetsPercent] = useState('0');

  const [belowMultiplier, setBelowMultiplier] = useState('0');
  const [aboveMultiplier, setAboveMultiplier] = useState('0');

  const [isUseAveragePurchasePrice, setIsUseAveragePurchasePrice] =
    useState(false);

  const resetAbove = () => {
    setAboveDesiredCurrencyRate('-');
    setAboveOrderPrice('-');
    setAboveOrderAmount('-');
    setAboveMultiplier('-');
  };

  const resetBelow = () => {
    setBelowDesiredCurrencyRate('-');
    setBelowOrderPrice('-');
    setBelowOrderAmount('-');
    setBelowMultiplier('-');
  };

  const calculateMisallocation = (
    isAbove: boolean,
    absoluteDifference: Decimal
  ) => {
    const desiredCurrencyRate = new Decimal(currentAssetsCurrencyRate);
    const orderPrice = new Decimal(totalAmount)
      .dividedBy(100)
      .times(absoluteDifference);
    const orderAmount = orderPrice.dividedBy(desiredCurrencyRate);

    if (isAbove) {
      setAboveDesiredCurrencyRate(desiredCurrencyRate.toString());
      setAboveOrderPrice(orderPrice.toString());
      setAboveOrderAmount(orderAmount.toString());
      setAboveMultiplier('0');

      resetBelow();
    } else {
      setBelowDesiredCurrencyRate(desiredCurrencyRate.toString());
      setBelowOrderPrice(orderPrice.toString());
      setBelowOrderAmount(orderAmount.toString());
      setBelowMultiplier('0');

      resetAbove();
    }
  };

  const setOrderDetails = (isAbove: boolean, assetsInUSD: Decimal) => {
    const thresholdDelta = isAbove
      ? aboveThresholdDeltaPercent
      : belowThresholdDeltaPercent;
    const { desiredCurrencyRate, orderPrice, orderAmount, multiplier } =
      calculateOrderDetails(
        idealAssetsPercent,
        thresholdDelta,
        totalAmount,
        assetsInUSD,
        assetsAmount,
        currentAssetsCurrencyRate,
        isAbove,
        averagePurchasePrice,
        isUseAveragePurchasePrice
      );

    if (isAbove) {
      setAboveDesiredCurrencyRate(desiredCurrencyRate);
      setAboveOrderPrice(orderPrice);
      setAboveOrderAmount(orderAmount);
      setAboveMultiplier(multiplier);
      dispatch(
        addLimitOrder({
          currencyPrice: desiredCurrencyRate,
          assetsQuantity: orderAmount,
          orderValue: orderPrice,
          orderType: 'SELL',
        })
      );
    } else {
      setBelowDesiredCurrencyRate(desiredCurrencyRate);
      setBelowOrderPrice(orderPrice);
      setBelowOrderAmount(orderAmount);
      setBelowMultiplier(multiplier);
      dispatch(
        addLimitOrder({
          currencyPrice: desiredCurrencyRate,
          assetsQuantity: orderAmount,
          orderValue: orderPrice,
          orderType: 'BUY',
        })
      );
    }
  };

  const handleOverweight = (
    differenceAssetsPercent: Decimal,
    assetsInUSD: Decimal
  ) => {
    const absoluteDifference = differenceAssetsPercent.abs();
    if (absoluteDifference.gte(new Decimal(aboveThresholdDeltaPercent))) {
      // Overweight!
      calculateMisallocation(true, absoluteDifference);
    } else {
      setOrderDetails(true, assetsInUSD);
      setOrderDetails(false, assetsInUSD);
    }
  };

  const handleUnderweight = (
    differenceAssetsPercent: Decimal,
    assetsInUSD: Decimal
  ) => {
    const absoluteDifference = differenceAssetsPercent.abs();
    if (absoluteDifference.gte(new Decimal(belowThresholdDeltaPercent))) {
      // Underweight!
      calculateMisallocation(false, absoluteDifference);
    } else {
      setOrderDetails(true, assetsInUSD);
      setOrderDetails(false, assetsInUSD);
    }
  };

  useEffect(() => {
    if (
      !assetsAmount ||
      !currentAssetsCurrencyRate ||
      !totalAmount ||
      !idealAssetsPercent ||
      !aboveThresholdDeltaPercent ||
      !belowThresholdDeltaPercent
    )
      return;

    const assetsInUSD = new Decimal(assetsAmount).times(
      currentAssetsCurrencyRate
    );
    setAssetsInUsd(assetsInUSD.toString());

    const actualAssetsPercent = assetsInUSD.dividedBy(totalAmount).times(100);
    setActualAssetsPercent(actualAssetsPercent.toString());

    const differenceAssetsPercent =
      actualAssetsPercent.minus(idealAssetsPercent);

    if (differenceAssetsPercent.gt(0)) {
      handleOverweight(differenceAssetsPercent, assetsInUSD);
    } else if (differenceAssetsPercent.lt(0)) {
      handleUnderweight(differenceAssetsPercent, assetsInUSD);
    } else {
      // Balance!
      setOrderDetails(true, assetsInUSD);
      setOrderDetails(false, assetsInUSD);
    }
  }, [
    totalAmount,
    assetsAmount,
    currentAssetsCurrencyRate,
    idealAssetsPercent,
    aboveThresholdDeltaPercent,
    belowThresholdDeltaPercent,
    averagePurchasePrice,
    isUseAveragePurchasePrice,
  ]);

  return (
    <CalculatorElement>
      <CurrencyTitle
        assetsCurrencyName={assetsCurrencyName}
        setAssetsCurrencyName={setAssetsCurrencyName}
        baseCurrencyName={baseCurrencyName}
        setBaseCurrencyName={setBaseCurrencyName}
        averagePurchasePrice={averagePurchasePrice}
        setAveragePurchasePrice={setAveragePurchasePrice}
        isUseAveragePurchasePrice={isUseAveragePurchasePrice}
        setIsUseAveragePurchasePrice={setIsUseAveragePurchasePrice}
      />
      <InitialDataContainer>
        <InitialData
          totalAmount={totalAmount}
          setTotalAmount={setTotalAmount}
          assetsAmount={assetsAmount}
          setAssetsAmount={setAssetsAmount}
          assetsCurrency={currentAssetsCurrencyRate}
          setAssetsCurrency={setCurrentAssetsCurrencyRate}
          assetsPercent={idealAssetsPercent}
          setAssetsPercent={setIdealAssetsPercent}
          baseCurrencyName={baseCurrencyName}
          assetsCurrencyName={assetsCurrencyName}
        />
        <PieChart
          totalAmount={totalAmount}
          assetsInUsd={assetsInUsd}
          idealAssetsPercent={idealAssetsPercent}
          belowThresholdDeltaPercent={belowThresholdDeltaPercent}
          aboveThresholdDeltaPercent={aboveThresholdDeltaPercent}
          actualAssetsPercent={actualAssetsPercent}
          baseCurrencyName={baseCurrencyName}
          assetsCurrencyName={assetsCurrencyName}
        />
      </InitialDataContainer>
      <ThresholdContainer>
        <ThresholdBlock
          thresholdName={'Below'}
          thresholdValue={belowThresholdDeltaPercent}
          setThresholdValue={setBelowThresholdDeltaPercent}
          desiredCurrency={belowDesiredCurrencyRate}
          orderPrice={belowOrderPrice}
          orderAmount={belowOrderAmount}
          baseCurrencyName={baseCurrencyName}
          assetsCurrencyName={assetsCurrencyName}
          multiplier={belowMultiplier}
        />
        <ThresholdBlock
          thresholdName={'Above'}
          thresholdValue={aboveThresholdDeltaPercent}
          setThresholdValue={setAboveThresholdDeltaPercent}
          desiredCurrency={aboveDesiredCurrencyRate}
          orderPrice={aboveOrderPrice}
          orderAmount={aboveOrderAmount}
          baseCurrencyName={baseCurrencyName}
          assetsCurrencyName={assetsCurrencyName}
          multiplier={aboveMultiplier}
        />
      </ThresholdContainer>
    </CalculatorElement>
  );
});

const CalculatorElement = styled.div`
  display: flex;
  flex-direction: column;
  width: 648px;
`;

const ThresholdContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InitialDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
