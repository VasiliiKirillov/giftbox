import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { InitialData } from '../components/Calculator/InitialData';
import { ThresholdBlock } from '../components/ThresholdBlock';
import Decimal from 'decimal.js';
import { CurrencyTitle } from '../components/Calculator/CurrencyTitle';
import { PieChart } from '../components/Calculator/PieChart';

export const CalculatorPage = memo(() => {
  const [baseCurrencyName, setBaseCurrencyName] = useState('USD'); // usd
  const [assetsCurrencyName, setAssetsCurrencyName] = useState('BTC'); // crypto

  // set by user
  const [totalAmount, setTotalAmount] = useState('100'); // usd
  const [assetsAmount, setAssetsAmount] = useState('14'); // crypto
  const [currentAssetsCurrencyRate, setCurrentAssetsCurrencyRate] =
    useState('2'); // usd
  const [idealAssetsPercent, setIdealAssetsPercent] = useState('25'); // percent
  const [aboveThresholdDeltaPercent, setAboveThresholdDeltaPercent] =
    useState('0');
  const [belowThresholdDeltaPercent, setBelowThresholdDeltaPercent] =
    useState('0');
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

    const multiplier = isAbove
      ? desiredCurrencyRate.dividedBy(currentAssetsCurrencyRate)
      : new Decimal(currentAssetsCurrencyRate).dividedBy(desiredCurrencyRate);
    console.log('gov multiplier', multiplier.toString());

    return {
      desiredCurrencyRate: desiredCurrencyRate.toString(),
      orderPrice: orderPrice.toString(),
      orderAmount: orderAmount.toString(),
      multiplier: multiplier.toString(),
    };
  }

  useEffect(() => {
    if (!assetsAmount || !currentAssetsCurrencyRate) return;
    const assetsInUSD = new Decimal(assetsAmount).times(
      currentAssetsCurrencyRate
    ); // (USD)
    setAssetsInUsd(assetsInUSD.toString());

    if (!assetsInUSD || !totalAmount) return;
    const actualAssetsPercent = new Decimal(assetsInUSD)
      .dividedBy(totalAmount)
      .times(100); // (%)
    setActualAssetsPercent(actualAssetsPercent.toString());

    if (!actualAssetsPercent || !idealAssetsPercent) return;
    const differenceAssetsPercent =
      actualAssetsPercent.minus(idealAssetsPercent); // (%)

    if (!aboveThresholdDeltaPercent || !belowThresholdDeltaPercent) return;

    if (differenceAssetsPercent.toNumber() > 0) {
      // overWeight
      if (
        differenceAssetsPercent.abs().toNumber() >=
        new Decimal(aboveThresholdDeltaPercent).toNumber()
      ) {
        // sold by market price
        const aboveDesiredCurrencyRate = new Decimal(currentAssetsCurrencyRate);
        const aboveOrderPrice = new Decimal(totalAmount)
          .dividedBy(100)
          .times(differenceAssetsPercent.abs());
        const aboveOrderAmount = aboveOrderPrice.dividedBy(
          aboveDesiredCurrencyRate
        );

        setAboveDesiredCurrencyRate(aboveDesiredCurrencyRate.toString());
        setAboveOrderPrice(aboveOrderPrice.toString());
        setAboveOrderAmount(aboveOrderAmount.toString());

        setBelowDesiredCurrencyRate('-');
        setBelowOrderPrice('-');
        setBelowOrderAmount('-');
      } else {
        // count limit orders
        // Example usage for "above" calculation
        const {
          desiredCurrencyRate: aboveDesiredCurrencyRate,
          orderPrice: aboveOrderPrice,
          orderAmount: aboveOrderAmount,
          multiplier: aboveMultiplier,
        } = calculateOrderDetails(
          idealAssetsPercent,
          aboveThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          currentAssetsCurrencyRate,
          true
        );
        setAboveDesiredCurrencyRate(aboveDesiredCurrencyRate);
        setAboveOrderPrice(aboveOrderPrice);
        setAboveOrderAmount(aboveOrderAmount);
        setAboveMultiplier(aboveMultiplier);

        // Example usage for "below" calculation
        const {
          desiredCurrencyRate: belowDesiredCurrencyRate,
          orderPrice: belowOrderPrice,
          orderAmount: belowOrderAmount,
          multiplier: belowMultiplier,
        } = calculateOrderDetails(
          idealAssetsPercent,
          belowThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          currentAssetsCurrencyRate,
          false
        );
        setBelowDesiredCurrencyRate(belowDesiredCurrencyRate);
        setBelowOrderPrice(belowOrderPrice);
        setBelowOrderAmount(belowOrderAmount);
        setBelowMultiplier(belowMultiplier);
      }
    } else if (differenceAssetsPercent.toNumber() < 0) {
      // lowerWeight
      if (
        differenceAssetsPercent.abs().toNumber() >=
        new Decimal(belowThresholdDeltaPercent).toNumber()
      ) {
        // sold by market price
        const belowDesiredCurrencyRate = new Decimal(currentAssetsCurrencyRate);
        const belowOrderPrice = new Decimal(totalAmount)
          .dividedBy(100)
          .times(differenceAssetsPercent.abs());
        const belowOrderAmount = belowOrderPrice.dividedBy(
          belowDesiredCurrencyRate
        );

        setAboveDesiredCurrencyRate('-');
        setAboveOrderPrice('-');
        setAboveOrderAmount('-');

        setBelowDesiredCurrencyRate(belowDesiredCurrencyRate.toString());
        setBelowOrderPrice(belowOrderPrice.toString());
        setBelowOrderAmount(belowOrderAmount.toString());
      } else {
        // count limit orders
        // Example usage for "above" calculation
        const {
          desiredCurrencyRate: aboveDesiredCurrencyRate,
          orderPrice: aboveOrderPrice,
          orderAmount: aboveOrderAmount,
          multiplier: aboveMultiplier,
        } = calculateOrderDetails(
          idealAssetsPercent,
          aboveThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          currentAssetsCurrencyRate,
          true
        );
        setAboveDesiredCurrencyRate(aboveDesiredCurrencyRate);
        setAboveOrderPrice(aboveOrderPrice);
        setAboveOrderAmount(aboveOrderAmount);
        setAboveMultiplier(aboveMultiplier);

        // Example usage for "below" calculation
        const {
          desiredCurrencyRate: belowDesiredCurrencyRate,
          orderPrice: belowOrderPrice,
          orderAmount: belowOrderAmount,
          multiplier: belowMultiplier,
        } = calculateOrderDetails(
          idealAssetsPercent,
          belowThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          currentAssetsCurrencyRate,
          false
        );
        setBelowDesiredCurrencyRate(belowDesiredCurrencyRate);
        setBelowOrderPrice(belowOrderPrice);
        setBelowOrderAmount(belowOrderAmount);
        setBelowMultiplier(belowMultiplier);
      }
    } else {
      // balance - do nothing
    }
  }, [
    totalAmount,
    assetsAmount,
    currentAssetsCurrencyRate,
    idealAssetsPercent,
    aboveThresholdDeltaPercent,
    belowThresholdDeltaPercent,
    aboveDesiredCurrencyRate,
    aboveOrderPrice,
    aboveOrderAmount,
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
