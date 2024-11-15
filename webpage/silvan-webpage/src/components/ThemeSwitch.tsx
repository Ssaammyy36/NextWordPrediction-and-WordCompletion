import React, { useState } from 'react';

function ThemeSwitch() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = (e) => {
    const newTheme = e.target.checked ? 'dark' : 'light'; 
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="form-check form-switch d-flex align-items-center justify-content-start">
      {/* Sonne-Icon, nur im Dark Mode */}
      <i 
        className="bi bi-sun" 
        style={{ 
          color: 'white',  
          visibility: theme === 'dark' ? 'visible' : 'hidden'  // Nur im Light Mode sichtbar
        }} 
      ></i>
      
      {/* Switch-Button */}
      <input
        className="form-check-input mx-2"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckDefault"
        checked={theme === 'dark'} // Checkbox ist aktiviert, wenn das Thema "dark" ist
        onChange={toggleTheme} // Setze das Thema beim Wechseln der Checkbox
      />
      
      {/* Mond-Icon, nur im Light Mode */}
      <i 
        className="bi bi-moon" 
        style={{ 
          color: 'black',  
          visibility: theme === 'light' ? 'visible' : 'hidden'  // Nur im Dark Mode sichtbar
        }} 
      ></i>
    </div>
  );
}

export default ThemeSwitch;
