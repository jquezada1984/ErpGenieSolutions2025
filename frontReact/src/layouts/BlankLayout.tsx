import React from "react";
import { Outlet } from "react-router-dom";

const BlankLayout: React.FC = () => (
  <div className="blank-layout" style={{ minHeight: '100vh', width: '100%' }}>
    <Outlet />
  </div>
);

export default BlankLayout; 