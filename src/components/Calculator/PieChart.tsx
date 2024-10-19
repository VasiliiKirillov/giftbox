import { FC, memo, useEffect, useRef } from 'react';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import styled from 'styled-components';

// Register the components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

let myChart: null | Chart<'doughnut'> = null;

const calculateOuterDoughnutData = (
  idealAssetsPercent: string,
  belowThresholdDeltaPercent: string,
  aboveThresholdDeltaPercent: string
) => {
  const initSegment =
    Number(idealAssetsPercent) - Number(belowThresholdDeltaPercent);
  const restSegment =
    100 - Number(idealAssetsPercent) - Number(aboveThresholdDeltaPercent);
  return [
    restSegment,
    Number(aboveThresholdDeltaPercent),
    Number(belowThresholdDeltaPercent),
    initSegment,
  ];
};

const helperRef = {
  idealAssetsPercent: '',
  actualAssetsPercent: '',
  baseCurrencyName: '',
  assetsCurrencyName: '',
};

type PieChartProps = {
  totalAmount: string;
  assetsInUsd: string;
  idealAssetsPercent: string;
  belowThresholdDeltaPercent: string;
  aboveThresholdDeltaPercent: string;
  actualAssetsPercent: string;
  baseCurrencyName: string;
  assetsCurrencyName: string;
};

export const PieChart: FC<PieChartProps> = memo(
  ({
    totalAmount,
    assetsInUsd,
    idealAssetsPercent,
    belowThresholdDeltaPercent,
    aboveThresholdDeltaPercent,
    actualAssetsPercent,
    baseCurrencyName,
    assetsCurrencyName,
  }) => {
    const pieChartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      if (pieChartRef.current === null) return;
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx === null) return;

      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: calculateOuterDoughnutData(
                idealAssetsPercent,
                belowThresholdDeltaPercent,
                aboveThresholdDeltaPercent
              ),
              backgroundColor: [
                'rgba(138,138,138,0.2)',
                'rgba(255,111,86,0.2)',
                'rgba(54,235,84,0.2)',
                'rgba(138,138,138,0.2)',
              ],
              borderColor: [
                'rgb(166,166,166)',
                'rgb(255,86,86)',
                'rgb(54,235,90)',
                'rgb(166,166,166)',
              ],
              borderWidth: 1,
            },
            {
              data: [
                Number(totalAmount) - Number(assetsInUsd),
                Number(assetsInUsd),
              ],
              backgroundColor: [
                'rgba(255,220,105,0.2)',
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: ['rgb(166,166,166)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          layout: {
            padding: {
              top: 50, // Add padding to ensure the doughnut is centered in the canvas
              bottom: 50,
              left: 50,
              right: 50,
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'My chart',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  // dataIndex: number,      // The index of the data point in the dataset
                  // datasetIndex: number,
                  const value = tooltipItem.raw;
                  // inner circle
                  if (tooltipItem.datasetIndex === 1) {
                    switch (tooltipItem.dataIndex) {
                      case 0:
                        return `Rest assets: ${value}${helperRef.baseCurrencyName}`;
                      case 1:
                        return `${helperRef.assetsCurrencyName} amount: ${value}${helperRef.baseCurrencyName}`;
                    }
                    // outer circle
                  } else if (tooltipItem.datasetIndex === 0) {
                    switch (tooltipItem.dataIndex) {
                      case 0: {
                        return '-';
                      }
                      case 1:
                        return `Above Threshold Delta: ${value}%`;
                      case 2:
                        return `Below Threshold Delta: ${value}%`;
                      case 3: {
                        return '-';
                      }
                    }
                  }
                },
              },
            },
          },
        },
        plugins: [
          {
            id: '1',
            afterDraw: function (chart) {
              const ctx = chart.ctx;
              const meta = chart.getDatasetMeta(0); // Get metadata for the dataset

              const segment = meta.data[1] as ArcElement;
              // Get center coordinates of the doughnut chart
              const centerX = segment.x;
              const centerY = segment.y;

              // Get the end angle and outer radius of the segment
              const endAngle = segment.endAngle;
              const outerRadius = segment.outerRadius;

              // Calculate the coordinates at the end of the segment
              const endX = centerX + Math.cos(endAngle) * outerRadius;
              const endY = centerY + Math.sin(endAngle) * outerRadius;

              ctx.beginPath();
              ctx.moveTo(endX, endY); // Start from the center of the segment
              ctx.lineTo(endX - 30, endY); // Draw a line outward
              ctx.strokeStyle = 'rgb(166,166,166)'; // Set line color
              ctx.stroke(); // Draw the line
              ctx.font = '12px Arial'; // Set font size and style
              ctx.fillStyle = 'black'; // Set text color
              ctx.fillText(
                `${helperRef.idealAssetsPercent}%`,
                endX - 30,
                endY - 5
              );
            },
          },
          {
            id: '2',
            afterDraw: function (chart) {
              const ctx = chart.ctx;
              const meta = chart.getDatasetMeta(1); // Get metadata for the dataset

              const segment = meta.data[0] as ArcElement;
              // Get center coordinates of the doughnut chart
              const centerX = segment.x;
              const centerY = segment.y;

              // Get the end angle and outer radius of the segment
              const endAngle = segment.endAngle;
              const outerRadius = segment.innerRadius;

              // Calculate the coordinates at the end of the segment
              const endX = centerX + Math.cos(endAngle) * outerRadius;
              const endY = centerY + Math.sin(endAngle) * outerRadius;

              ctx.beginPath();
              ctx.moveTo(endX, endY); // Start from the center of the segment
              ctx.lineTo(endX + 35, endY); // Draw a line outward
              ctx.strokeStyle = 'rgba(54, 162, 235, 1)'; // Set line color
              ctx.stroke(); // Draw the line
              ctx.font = '12px Arial'; // Set font size and style
              ctx.fillStyle = 'black'; // Set text color
              ctx.fillText(
                `${helperRef.actualAssetsPercent}%`,
                endX + 10,
                endY - (Number(helperRef.actualAssetsPercent) > 12 ? 5 : -7)
              );
            },
          },
        ],
      });
      return () => {
        myChart?.destroy();
      };
    }, []);

    // set names of currencies for piechart
    useEffect(() => {
      if (myChart === null) return;

      helperRef.baseCurrencyName = baseCurrencyName;
      helperRef.assetsCurrencyName = assetsCurrencyName;
    }, [baseCurrencyName, assetsCurrencyName]);

    // calculate data for inner chart
    useEffect(() => {
      if (myChart === null) return;

      helperRef.actualAssetsPercent = actualAssetsPercent;

      myChart.data.datasets[1].data = [
        Number(totalAmount) - Number(assetsInUsd),
        Number(assetsInUsd),
      ];
      myChart.update();
    }, [totalAmount, assetsInUsd]);

    // calculate data for outer chart
    useEffect(() => {
      if (myChart === null) return;

      helperRef.idealAssetsPercent = idealAssetsPercent;

      myChart.data.datasets[0].data = calculateOuterDoughnutData(
        idealAssetsPercent,
        belowThresholdDeltaPercent,
        aboveThresholdDeltaPercent
      );
      myChart.update();
    }, [
      actualAssetsPercent,
      idealAssetsPercent,
      belowThresholdDeltaPercent,
      aboveThresholdDeltaPercent,
    ]);

    return (
      <CanvasContent
        ref={pieChartRef}
        id="myDoughnutChart"
        width="400"
        height="400"
      ></CanvasContent>
    );
  }
);

const CanvasContent = styled.canvas`
  width: 400px;
  height: 400px;
`;
