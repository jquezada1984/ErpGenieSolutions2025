import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Themeroutes from './routes/Router';
import ThemeSelector from './layouts/theme/ThemeSelector';
import Loader from './layouts/loader/Loader';

interface RootState {
  customizer: {
    isRTL: boolean;
    isDark: boolean;
  };
}

function App() {
  const routing = useRoutes(Themeroutes);
  const direction = useSelector((state: RootState) => state.customizer.isRTL);
  const isMode = useSelector((state: RootState) => state.customizer.isDark);
  return (
    <Suspense fallback={<Loader />}>
      <div
        className={`${direction ? 'rtl' : 'ltr'} ${isMode ? 'dark' : ''}`}
        dir={direction ? 'rtl' : 'ltr'}
      >
        <ThemeSelector />
        {routing}
      </div>
    </Suspense>
  );
}

export default App
