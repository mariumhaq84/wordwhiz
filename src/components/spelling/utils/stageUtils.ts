
export type DisplayMode = 'full' | 'partial' | 'input';

export const getStageColor = (displayMode: DisplayMode): string => {
  if (displayMode === 'full') return 'bg-gradient-to-b from-blue-50 to-purple-100';
  if (displayMode === 'partial') return 'bg-gradient-to-b from-yellow-50 to-amber-100';
  return 'bg-gradient-to-b from-green-50 to-emerald-100';
};

export const getStageIcon = (displayMode: DisplayMode) => {
  return displayMode;
};
