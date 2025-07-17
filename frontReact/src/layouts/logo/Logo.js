import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import LogoDarkIcon from '../../assets/images/logos/xtreme-dark-icon.svg';
import LogoDarkText from '../../assets/images/logos/xtreme-dark-text.svg';
import LogoWhiteIcon from '../../assets/images/logos/xtreme-white-icon.svg';
import LogoWhiteText from '../../assets/images/logos/xtreme-white-text.svg';

const Logo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const activeSidebarBg = useSelector((state) => state.customizer.sidebarBg);
  return (
    <Link to="/" className="d-flex align-items-center gap-2">
      {isDarkMode || activeSidebarBg !== 'white' ? (
        <>
          <img src={LogoWhiteIcon} alt="Logo" height={40} />
          {toggleMiniSidebar ? '' : <img src={LogoWhiteText} alt="Logo texto" height={40} />}
        </>
      ) : (
        <>
          <img src={LogoDarkIcon} alt="Logo" height={40} />
          {toggleMiniSidebar ? '' : <img src={LogoDarkText} alt="Logo texto" height={40} />}
        </>
      )}
    </Link>
  );
};

export default Logo;
