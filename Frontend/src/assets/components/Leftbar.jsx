import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Leftbar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  const menuItems = [
    { name: "Carbon Credit", path: "/" },
    { name: "Carbon Estimation", path: "/carbonestimation" },
    { name: "Tree Identification", path: "/identification" }
  ];

  // Set the active menu item based on the current path
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => item.path === currentPath);
    if (activeItem) {
      setActiveMenu(activeItem.name);
    }
  }, [location, menuItems]);

  const getMenuClass = (menu) => 
    menu === activeMenu 
      ? "bg-green-100 border-green-500 flex flex-row items-center border-y border-l px-2 py-1 mb-5 cursor-pointer text-slate-700 rounded-l" 
      : "flex flex-row items-center border-y border-l px-2 py-1 mb-5 cursor-pointer text-slate-700 border-slate-400 rounded-l";

  return (
    <div className='w-[18vw] h-[70vh] pl-[3vw] border-r-2 pt-[3vw]'>
      {menuItems.map(item => (
        <NavLink 
          key={item.name} 
          to={item.path}
          onClick={() => setActiveMenu(item.name)} 
          className={getMenuClass(item.name)}
        >
          <span className='md:block hidden font-medium'>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default Leftbar;
