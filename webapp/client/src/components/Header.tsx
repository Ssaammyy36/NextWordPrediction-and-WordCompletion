import React from "react";
import ThemeSwitch from "./ThemeSwitch";

const Header = () => {
  return (
    <header>
      <div className="d-flex pb-3 mb-4 border-bottom ">
        <h3 className="me-auto">Word prediction</h3>
        <div>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
};

export default Header;
