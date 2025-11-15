import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';

import '@/styles/globals.css';
import Providers from '@/providers/Providers.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>,
);
