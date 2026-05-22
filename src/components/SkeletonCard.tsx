import React from 'react';

interface SkeletonCardProps {
  index?: number;
  width?: number;
  height?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ index = 0, width = 600, height = 400 }) => {
  // 根据图片实际宽高比计算占位图高度
  // 假设容器宽度为固定值，根据宽高比计算高度
  const aspectRatio = height / width;
  const containerWidth = 300; // Grid 单列宽度
  const skeletonHeight = containerWidth * aspectRatio;

  return (
    <div
      className="break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 animate-pulse"
      style={{ height: `${skeletonHeight}px` }}
    >
      <div className="w-full h-full bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-200" />
    </div>
  );
};

export default SkeletonCard;
