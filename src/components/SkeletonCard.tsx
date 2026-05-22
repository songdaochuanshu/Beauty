import React from 'react';

interface SkeletonCardProps {
  index: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ index }) => {
  const heights = [280, 360, 240, 400, 300, 320];
  const height = heights[index % heights.length];

  return (
    <div
      className="break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 animate-pulse"
      style={{ height: `${height}px` }}
    >
      <div className="w-full h-full bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-200" />
    </div>
  );
};

export default SkeletonCard;