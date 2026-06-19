import React from 'react';

interface SkeletonCardProps {
  index?: number;
  width?: number;
  height?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ index = 0, width = 600, height = 400 }) => {
  // 使用 padding-bottom 百分比来维持纵横比，这样不需要关心容器的具体宽度
  const aspectRatio = (height / width) * 100;

  // 如果没有传入宽高，则根据索引生成一些随机高度的占位图，使瀑布流看起来更自然
  const randomHeights = [120, 150, 180, 140, 160, 130];
  const finalPadding = (width === 600 && height === 400) 
    ? randomHeights[index % randomHeights.length] 
    : aspectRatio;

  return (
    <div className="break-inside-avoid mb-6 overflow-hidden rounded-xl bg-neutral-100 animate-pulse">
      <div 
        style={{ paddingBottom: `${finalPadding}%` }} 
        className="w-full bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-200" 
      />
    </div>
  );
};

export default SkeletonCard;
