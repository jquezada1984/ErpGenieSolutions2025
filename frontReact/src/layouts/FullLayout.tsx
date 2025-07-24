import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Sidebar from './sidebars/vertical/Sidebar';
import HorizontalHeader from './header/HorizontalHeader';
import HorizontalSidebar from './sidebars/horizontal/HorizontalSidebar';
import store from '../store/Store';
import { useSessionCheck } from '../hooks/useSessionCheck';

type RootState = ReturnType<typeof store.getState>;

const FullLayout = () => {
  // Verificar sesión periódicamente
  useSessionCheck();
  const customizerToggle = useSelector((state: RootState) => state.customizer.customizerSidebar);
  const toggleMiniSidebar = useSelector((state: RootState) => state.customizer.isMiniSidebar);
  const showMobileSidebar = useSelector((state: RootState) => state.customizer.isMobileSidebar);
  const topbarFixed = useSelector((state: RootState) => state.customizer.isTopbarFixed);
  const LayoutHorizontal = useSelector((state: RootState) => state.customizer.isLayoutHorizontal);
  const isFixedSidebar = useSelector((state: RootState) => state.customizer.isSidebarFixed);
  return (
    <main>
      <div
        className={`pageWrapper d-md-block d-lg-flex ${toggleMiniSidebar ? 'isMiniSidebar' : ''}`}
      >
        {/******** Sidebar *********/}
        {LayoutHorizontal ? (
          ''
        ) : (
          <aside className={`sidebarArea ${showMobileSidebar ? 'showSidebar' : ''}`}>
            <Sidebar />
          </aside>
        )}
        {/********Content Area********/}

        <div className={`contentArea ${topbarFixed ? 'fixedTopbar' : ''}`}>
          {/********header********/}
          {LayoutHorizontal ? <HorizontalHeader /> : <Header />}
          {LayoutHorizontal ? <HorizontalSidebar /> : ''}
          {/********Middle Content********/}
          <Container className="p-4">
            <div className={isFixedSidebar && LayoutHorizontal ? 'HsidebarFixed' : ''}>
              <Outlet />
            </div>
            {/* Customizer eliminado */}
            {/* {showMobileSidebar || customizerToggle ? <div className="sidebarOverlay" /> : ''} */}
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;