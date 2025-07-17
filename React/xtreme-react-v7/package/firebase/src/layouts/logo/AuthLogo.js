import React from 'react';
import { useSelector } from 'react-redux';

import LogoDarkIcon from '../../assets/images/logos/xtreme-dark-icon.svg';
import LogoDarkText from '../../assets/images/logos/xtreme-dark-text.svg';
import LogoWhiteIcon from '../../assets/images/logos/xtreme-white-icon.svg';
import LogoWhiteText from '../../assets/images/logos/xtreme-white-text.svg';

const AuthLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);

  return (
    <div className="p-4 d-flex justify-content-center gap-2">
      {isDarkMode !== false ? (
        <>
          <img src={LogoWhiteIcon} alt="Logo" height={40} />
          <img src={LogoWhiteText} alt="Logo texto" height={40} />
        </>
      ) : (
        <>
          <img src={LogoDarkIcon} alt="Logo" height={40} />
          <img src={LogoDarkText} alt="Logo texto" height={40} />
        </>
      )}
    </div>
  );
};

export default AuthLogo;
