import React from "react";
import CIcon from "@coreui/icons-react";

// const menu = localStorage.getItem('menu_role');

const _nav = JSON.parse(localStorage.getItem("menu_role"));

const _dummy_nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Administrator"],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Administrator",
    route: "/administrator",
    icon: "cil-spreadsheet",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "User",
        to: "/administrator/user",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Department",
        to: "/administrator/department",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Section",
        to: "/administrator/section",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Menu Parent",
        to: "/administrator/menu_parent",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Menu Child",
        to: "/administrator/menu_child",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Roles Section",
        to: "/administrator/role_section",
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Configuration",
    to: "/configuration",
  },
];

export default _nav;
