import React from 'react';

interface InfoPanelProps {
  title: string;
  children: React.ReactNode;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ title, children }) => {
  return (
    <div className="bg-ekopia-card border border-ekopia-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-ekopia-border pb-2">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};