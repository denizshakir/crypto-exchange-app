import React, { FC } from 'react';
import { useTheme } from '@heroui/use-theme';

import ThemeContext from '@/contexts/ThemeContext';

interface IThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: FC<IThemeProviderProps> = (props) => {
  const { children } = props;

  const value = useTheme();

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
