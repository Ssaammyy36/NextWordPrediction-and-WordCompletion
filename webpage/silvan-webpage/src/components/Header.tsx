import React from "react";
import ThemeSwitch from "./ThemeSwitch";

const Header = () => {
  return (
    <header>
      <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
        <h3 className="me-auto">Word prediction</h3>
        <div className="d-inline-flex mt-2 mt-md-0">
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
};

moud 
export default Header;
