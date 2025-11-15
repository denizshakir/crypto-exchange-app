import { useTheme } from '@heroui/use-theme';
import { createContext } from 'react';

const ThemeContext = createContext<ReturnType<typeof useTheme>>({
  theme: 'light',
  setTheme: () => {},
});

export default ThemeContext;
