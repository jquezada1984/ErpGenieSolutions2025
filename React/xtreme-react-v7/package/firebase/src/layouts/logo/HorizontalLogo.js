import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import LogoDarkIcon from '../../assets/images/logos/xtreme-dark-icon.svg';
import LogoDarkText from '../../assets/images/logos/xtreme-dark-text.svg';
import LogoWhiteIcon from '../../assets/images/logos/xtreme-white-icon.svg';
import LogoWhiteText from '../../assets/images/logos/xtreme-white-text.svg';

const HorizontalLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const activetopbarBg = useSelector((state) => state.customizer.topbarBg);
  return (
    <Link to="/" className="d-flex align-items-center gap-2">
      {isDarkMode || activetopbarBg !== 'white' ? (
        <>
          <img src={LogoWhiteIcon} alt="Logo" height={40} />
          <img src={LogoWhiteText} alt="Logo texto" height={40} className="d-none d-lg-block" />
        </>
      ) : (
        <>
          <img src={LogoDarkIcon} alt="Logo" height={40} />
          <img src={LogoDarkText} alt="Logo texto" height={40} className="d-none d-lg-block" />
        </>
      )}
    </Link>
  );
};

export default HorizontalLogo;
