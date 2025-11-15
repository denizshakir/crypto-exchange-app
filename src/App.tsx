import { Route, Routes } from 'react-router-dom';

import Home from '@/pages/Home/Home';
import DetailsPage from '@/pages/Details/Details';

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Home />} path="/:pairs" />
      <Route element={<DetailsPage />} path="/:pairs/details" />
      <Route element={<DetailsPage />} path="/:pairs/details/:exchange" />
    </Routes>
  );
}

export default App;
