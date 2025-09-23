import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ReactNode;
  variant: 'primary' | 'success' | 'warning' | 'default';
}

export const StatCard = (props: StatCardProps) => (
  <div>
    <h4>{props.title}</h4>
    <p>{props.value}</p>
  </div>
);
