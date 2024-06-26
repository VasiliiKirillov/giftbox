import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { InitialData } from '../components/Calculator/InitialData';
import { ThresholdBlock } from '../components/ThresholdBlock';
import Decimal from 'decimal.js';

export const CalculatorPage = memo(() => {
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

  function calculateOrderDetails(
    idealAssetsPercent: string,
    thresholdDeltaPercent: string,
    totalAmount: string,
    assetsInUSD: Decimal,
    assetsAmount: string,
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

    return {
      desiredCurrencyRate: desiredCurrencyRate.toString(),
      orderPrice: orderPrice.toString(),
      orderAmount: orderAmount.toString(),
    };
  }

  useEffect(() => {
    if (!assetsAmount || !currentAssetsCurrencyRate) return;
    const assetsInUSD = new Decimal(assetsAmount).times(
      currentAssetsCurrencyRate
    ); // (USD)

    if (!assetsInUSD || !totalAmount) return;
    const actualAssetsPercent = new Decimal(assetsInUSD)
      .dividedBy(totalAmount)
      .times(100); // (%)

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
        } = calculateOrderDetails(
          idealAssetsPercent,
          aboveThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          true
        );
        setAboveDesiredCurrencyRate(aboveDesiredCurrencyRate);
        setAboveOrderPrice(aboveOrderPrice);
        setAboveOrderAmount(aboveOrderAmount);

        // Example usage for "below" calculation
        const {
          desiredCurrencyRate: belowDesiredCurrencyRate,
          orderPrice: belowOrderPrice,
          orderAmount: belowOrderAmount,
        } = calculateOrderDetails(
          idealAssetsPercent,
          belowThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          false
        );
        setBelowDesiredCurrencyRate(belowDesiredCurrencyRate);
        setBelowOrderPrice(belowOrderPrice);
        setBelowOrderAmount(belowOrderAmount);
      }
    } else if (differenceAssetsPercent.toNumber() < 0) {
      // lowerWeight
      // I'm here
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
        } = calculateOrderDetails(
          idealAssetsPercent,
          aboveThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          true
        );
        setAboveDesiredCurrencyRate(aboveDesiredCurrencyRate);
        setAboveOrderPrice(aboveOrderPrice);
        setAboveOrderAmount(aboveOrderAmount);

        // Example usage for "below" calculation
        const {
          desiredCurrencyRate: belowDesiredCurrencyRate,
          orderPrice: belowOrderPrice,
          orderAmount: belowOrderAmount,
        } = calculateOrderDetails(
          idealAssetsPercent,
          belowThresholdDeltaPercent,
          totalAmount,
          assetsInUSD,
          assetsAmount,
          false
        );
        setBelowDesiredCurrencyRate(belowDesiredCurrencyRate);
        setBelowOrderPrice(belowOrderPrice);
        setBelowOrderAmount(belowOrderAmount);
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
      <InitialData
        totalAmount={totalAmount}
        setTotalAmount={setTotalAmount}
        assetsAmount={assetsAmount}
        setAssetsAmount={setAssetsAmount}
        assetsCurrency={currentAssetsCurrencyRate}
        setAssetsCurrency={setCurrentAssetsCurrencyRate}
        assetsPercent={idealAssetsPercent}
        setAssetsPercent={setIdealAssetsPercent}
      />
      <ThresholdContainer>
        <ThresholdBlock
          thresholdName={'Above'}
          thresholdValue={aboveThresholdDeltaPercent}
          setThresholdValue={setAboveThresholdDeltaPercent}
          desiredCurrency={aboveDesiredCurrencyRate}
          orderPrice={aboveOrderPrice}
          orderAmount={aboveOrderAmount}
        />
        <ThresholdBlock
          thresholdName={'Below'}
          thresholdValue={belowThresholdDeltaPercent}
          setThresholdValue={setBelowThresholdDeltaPercent}
          desiredCurrency={belowDesiredCurrencyRate}
          orderPrice={belowOrderPrice}
          orderAmount={belowOrderAmount}
        />
      </ThresholdContainer>
    </CalculatorContainer>
  );
});

const CalculatorContainer = styled.div`
  width: 1000px;
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const ThresholdContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
