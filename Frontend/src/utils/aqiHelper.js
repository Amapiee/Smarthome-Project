export const getPM25Color = (value) => {
  if (value <= 25) return 'bg-green-400';
  if (value <= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getCO2Color = (value) => {
  if (value <= 400) return 'bg-green-400';
  if (value <= 1000) return 'bg-yellow-500';
  return 'bg-red-500';
};