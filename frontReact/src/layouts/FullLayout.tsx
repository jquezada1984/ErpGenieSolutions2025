import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Sidebar from './sidebars/vertical/Sidebar';
import store from '../store/Store';
import { useSessionCheck } from '../hooks/useSessionCheck';

type RootState = ReturnType<typeof store.getState>;

const FullLayout = () => {
  // Verificar sesión periódicamente
  useSessionCheck();
  const toggleMiniSidebar = useSelector((state: RootState) => state.customizer.isMiniSidebar);
  const showMobileSidebar = useSelector((state: RootState) => state.customizer.isMobileSidebar);
  const topbarFixed = useSelector((state: RootState) => state.customizer.isTopbarFixed);
  return (
    <main>
      <div
        className={`pageWrapper d-md-block d-lg-flex ${toggleMiniSidebar ? 'isMiniSidebar' : ''}`}
      >
        {/******** Sidebar *********/}
        <aside className={`sidebarArea ${showMobileSidebar ? 'showSidebar' : ''}`}>
          <Sidebar />
        </aside>
        {/********Content Area********/}

        <div className={`contentArea ${topbarFixed ? 'fixedTopbar' : ''}`}>
          {/********header********/}
          <Header />
          {/********Middle Content********/}
          <Container className="p-4">
            <div>
              <Outlet />
            </div>
            {/* Customizer eliminado */}
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;