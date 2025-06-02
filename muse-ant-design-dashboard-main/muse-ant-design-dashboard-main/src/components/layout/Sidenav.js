/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { Menu} from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  // Icônes SVG (inchangées)
  
  // Création des items du menu
  const menuItems = [
   
    {
      key: '2',
      label: (
        <NavLink to="/Home">
          <span className="icon" style={{ background: page === "tables" ? color : "" }}>
            {/* Icône tables... */}
          </span>
          <span className="label">Vos Transactions</span>
        </NavLink>
      ),
    },
   
    {
      key: '5',
      label: 'Account Pages',
      className: 'menu-item-header',
    },
    {
      key: '6',
      label: (
        <NavLink to="/profile">
          <span className="icon" style={{ background: page === "profile" ? color : "" }}>
            {/* Icône profile... */}
          </span>
          <span className="label">Profile</span>
        </NavLink>
      ),
    },
    {
      key: '7',
      label: (
        <NavLink to="/sign-in">
          <span className="icon">{/* Icône signin... */}</span>
          <span className="label">Sign In</span>
        </NavLink>
      ),
    },
    {
      key: '8',
      label: (
        <NavLink to="/sign-up">
          <span className="icon">{/* Icône signup... */}</span>
          <span className="label">Sign Up</span>
        </NavLink>
      ),
    },
  ];

  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Muse Dashboard</span>
      </div>
      <hr />
      <Menu 
        theme="light" 
        mode="inline" 
        items={menuItems}
      />
     
    </>
  );
}

export default Sidenav;