import React from 'react';
import { Line } from '@ant-design/charts';

const HistoricalChart = ({ data }: { data: { date: string; price: number }[] }) => {
  const config = {
    data,
    xField: 'date',
    yField: 'price',
    point: {
      size: 4,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#1890ff', 
        lineWidth: 2,
      },
    },
    lineStyle: {
      stroke: '#52c41a', 
      lineWidth: 3,
    },
    tooltip: {
      showCrosshairs: true,
      shared: true,
      itemTpl:
        '<li class="g2-tooltip-list-item" data-index={index}>' +
        '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
        '{name}: <span style="font-weight:bold;">{value}</span></li>',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1500,
      },
    },
    xAxis: {
      title: {
        text: 'Date',
        style: { fontSize: 14, fontWeight: 600, fill: '#595959' }, 
      },
      label: {
        style: { fontSize: 12, fill: '#8c8c8c' }, 
      },
    },
    yAxis: {
      title: {
        text: 'Price (USD)',
        style: { fontSize: 14, fontWeight: 600, fill: '#595959' },
      },
      label: {
        style: { fontSize: 12, fill: '#8c8c8c' },
      },
      min: Math.min(...data.map((d) => d.price)) * 0.9,
    },
    legend: {
      position: 'top',
      itemName: {
        style: {
          fontWeight: 500,
          fontSize: 12,
        },
      },
    },
  };

  return (
    <div className="w-full sm:w-3/4 lg:w-1/2 mx-auto p-4 bg-white rounded-md shadow-md">
      <Line {...config} />
    </div>
  );
};

export default HistoricalChart;
