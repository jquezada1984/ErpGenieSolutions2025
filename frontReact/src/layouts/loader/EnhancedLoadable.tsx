import React, { Suspense } from "react";
import EnhancedLoader from "../../components/EnhancedLoader";

// ===========================|| ENHANCED LOADABLE - LAZY LOADING ||=========================== //

const EnhancedLoadable = (Component, options = {}) => {
  const {
    message = 'Cargando módulo...',
    showProgress = true,
    fallback = <EnhancedLoader message={message} showProgress={showProgress} />
  } = options;

  return (props) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

export default EnhancedLoadable; 