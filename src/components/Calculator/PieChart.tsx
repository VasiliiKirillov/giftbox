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

type PieChartProps = {
  totalAmount: string;
  assetsInUsd: string;
};

export const PieChart: FC<PieChartProps> = memo(
  ({ totalAmount, assetsInUsd }) => {
    console.log('22', assetsInUsd);
    const pieChartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      if (myChart === null) return;

      myChart.data.datasets[0].data = [
        Number(totalAmount) - Number(assetsInUsd),
        Number(assetsInUsd),
      ]; // Update the dataset
      myChart.update();
    }, [totalAmount, assetsInUsd]);

    useEffect(() => {
      if (pieChartRef.current === null) return;
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx === null) return;

      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['USD', 'BTC'],
          datasets: [
            {
              data: [
                Number(totalAmount) - Number(assetsInUsd),
                Number(assetsInUsd),
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'My chart',
            },
          },
        },
      });
      return () => {
        myChart?.destroy();
      };
    }, []);

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
