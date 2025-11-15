export const extractSymbolId = (pair: string, join = ''): string => {
  return pair?.split('_').join(join) || '';
};
