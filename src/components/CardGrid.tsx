
import React from 'react';

interface CardGridProps {
  children: React.ReactNode;
  columns?: number;
}

const CardGrid: React.FC<CardGridProps> = ({ children, columns = 3 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
      {children}
    </div>
  );
};

export default CardGrid;
