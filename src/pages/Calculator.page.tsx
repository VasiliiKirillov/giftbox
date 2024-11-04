import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { InitialData } from '../components/Calculator/InitialData';
import { ThresholdBlock } from '../components/ThresholdBlock';
import Decimal from 'decimal.js';
import { CurrencyTitle } from '../components/Calculator/CurrencyTitle';
import { PieChart } from '../components/Calculator/PieChart';

function calculateOrderDetails(
  idealAssetsPercent: string,
  thresholdDeltaPercent: string,
  totalAmount: string,
  assetsInUSD: Decimal,
  assetsAmount: string,
  currentAssetsCurrencyRate: string,
  isAbove: boolean
) {
  const thresholdPercent = isAbove
    ? new Decimal(idealAssetsPercent).plus(thresholdDeltaPercent)
    : new Decimal(idealAssetsPercent).minus(thresholdDeltaPercent);
  const thresholdRatio = thresholdPercent.dividedBy(100);
  const desiredAssets = new Decimal(totalAmount)
    .minus(assetsInUSD)
    .times(thresholdRatio)
    .dividedBy(new Decimal(1).minus(thresholdRatio));

  const desiredCurrencyRate = desiredAssets.dividedBy(assetsAmount);
  const orderPrice = new Decimal(
    desiredAssets.plus(totalAmount).minus(assetsInUSD)
  )
    .dividedBy(100)
    .times(thresholdDeltaPercent);
  const orderAmount = orderPrice.dividedBy(desiredCurrencyRate);
  let multiplier = new Decimal(0);
  try {
    multiplier = isAbove
      ? desiredCurrencyRate
          .minus(currentAssetsCurrencyRate)
          .dividedBy(currentAssetsCurrencyRate)
          .times(100)
      : new Decimal(currentAssetsCurrencyRate)
          .minus(desiredCurrencyRate)
          .dividedBy(currentAssetsCurrencyRate)
          .times(100);
  } catch (e) {
    console.log(e);
  }

  return {
    desiredCurrencyRate: desiredCurrencyRate.toString(),
    orderPrice: orderPrice.toString(),
    orderAmount: orderAmount.toString(),
    multiplier: multiplier.toString(),
  };
}

export const CalculatorPage = memo(() => {
  const [baseCurrencyName, setBaseCurrencyName] = useState('USD'); // usd
  const [assetsCurrencyName, setAssetsCurrencyName] = useState('BTC'); // crypto

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

  const calculateAndSetOrder = (
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
        isAbove
      );

    if (isAbove) {
      setAboveDesiredCurrencyRate(desiredCurrencyRate);
      setAboveOrderPrice(orderPrice);
      setAboveOrderAmount(orderAmount);
      setAboveMultiplier(multiplier);
    } else {
      setBelowDesiredCurrencyRate(desiredCurrencyRate);
      setBelowOrderPrice(orderPrice);
      setBelowOrderAmount(orderAmount);
      setBelowMultiplier(multiplier);
    }
  };

  const handleOverweight = (
    differenceAssetsPercent: Decimal,
    assetsInUSD: Decimal
  ) => {
    const absoluteDifference = differenceAssetsPercent.abs();
    if (absoluteDifference.gte(new Decimal(aboveThresholdDeltaPercent))) {
      calculateAndSetOrder(true, absoluteDifference);
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
      calculateAndSetOrder(false, absoluteDifference);
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
      resetAbove();
      resetBelow();
    }
  }, [
    totalAmount,
    assetsAmount,
    currentAssetsCurrencyRate,
    idealAssetsPercent,
    aboveThresholdDeltaPercent,
    belowThresholdDeltaPercent,
  ]);

  return (
    <CalculatorContainer>
      <CurrencyTitle
        assetsCurrencyName={assetsCurrencyName}
        setAssetsCurrencyName={setAssetsCurrencyName}
        baseCurrencyName={baseCurrencyName}
        setBaseCurrencyName={setBaseCurrencyName}
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
    </CalculatorContainer>
  );
});

const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThresholdContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InitialDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
