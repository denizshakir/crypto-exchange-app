import { useHref, useNavigate, NavigateOptions } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/system';
import { Provider } from 'react-redux';

import ThemeProvider from './ThemeProvider';

import store from '@/store';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <Provider store={store}>
      <ThemeProvider>
        <HeroUIProvider navigate={navigate} useHref={useHref}>
          {children}
        </HeroUIProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
