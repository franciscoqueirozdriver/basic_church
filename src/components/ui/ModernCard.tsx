import React from 'react';

export const ModernCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
);
export const ModernCardHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const ModernCardTitle = ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>;
export const ModernCardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
