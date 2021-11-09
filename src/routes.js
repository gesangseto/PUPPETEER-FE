import React from "react";
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
// MY ROUTE
// ========================================================================
const ListMenuParent = React.lazy(() =>
  import("./views/system/menu_parent/ListMenuParent")
);
const FormMenuParent = React.lazy(() =>
  import("./views/system/menu_parent/FormMenuParent")
);
// ========================================================================
const ListMenuChild = React.lazy(() =>
  import("./views/system/menu_child/ListMenuChild")
);
const FormMenuChild = React.lazy(() =>
  import("./views/system/menu_child/FormMenuChild")
);
// ========================================================================
const FormConfiguration = React.lazy(() =>
  import("./views/system/configuration/FormConfiguration")
);
// ========================================================================
const ListAuditLog = React.lazy(() =>
  import("./views/system/audit_log/ListAuditLog")
);
// ========================================================================
const FormAuditLog = React.lazy(() =>
  import("./views/system/audit_log/FormAuditLog")
);
// ========================================================================
// END OFF MY ROUTE
const ListUser = React.lazy(() =>
  import("./views/administrator/user/ListUser")
);
const FormUser = React.lazy(() =>
  import("./views/administrator/user/FormUser")
);
// ========================================================================
const ListDepartment = React.lazy(() =>
  import("./views/administrator/department/ListDepartment")
);
const FormDepartment = React.lazy(() =>
  import("./views/administrator/department/FormDepartment")
);
// ========================================================================
const ListSection = React.lazy(() =>
  import("./views/administrator/section/ListSection")
);
const FormSection = React.lazy(() =>
  import("./views/administrator/section/FormSection")
);
// ========================================================================
const ListRoleSection = React.lazy(() =>
  import("./views/administrator/role_section/ListRoleSection")
);
const FormRoleSection = React.lazy(() =>
  import("./views/administrator/role_section/FormRoleSection")
);
//
// PUPPETEER
// ========================================================================
const ListPuppeteer = React.lazy(() =>
  import("./views/puppeteer/puppeteer/ListPuppeteer")
);
const FormPuppeteer = React.lazy(() =>
  import("./views/puppeteer/puppeteer/FormPuppeteer")
);
// ========================================================================

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/404", name: "404", component: Page404 },

  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  // ========================================================================
  {
    path: "/system/configuration",
    name: "Configuration",
    component: FormConfiguration,
  },
  // ========================================================================
  {
    path: "/system/audit_log/:type/:id",
    name: "Manage Audit",
    component: FormAuditLog,
  },
  // ========================================================================
  {
    path: "/system/audit_log",
    name: "Audit",
    component: ListAuditLog,
  },
  // ========================================================================
  // START MENU SETTING
  {
    path: "/system/menu_parent/:type/:id",
    name: "Manage",
    component: FormMenuParent,
  },
  {
    path: "/system/menu_parent/:type",
    name: "Add",
    component: FormMenuParent,
  },
  {
    path: "/system/menu_parent",
    name: "Menu Parent",
    component: ListMenuParent,
  },
  // ========================================================================
  {
    path: "/system/menu_child/:type/:id",
    name: "Manage",
    component: FormMenuChild,
  },
  {
    path: "/system/menu_child/:type",
    name: "Add",
    component: FormMenuChild,
  },
  {
    path: "/system/menu_child",
    name: "Menu Child",
    component: ListMenuChild,
  },
  // ========================================================================
  // END OFF MENU SETTING

  // START MENU MASTER
  {
    path: "/administrator/user/:type/:id",
    name: "Manage",
    component: FormUser,
  },
  { path: "/administrator/user/:type", name: "Add", component: FormUser },
  { path: "/administrator/user", name: "User", component: ListUser },
  // ========================================================================
  {
    path: "/administrator/department/:type/:id",
    name: "Manage",
    component: FormDepartment,
  },
  {
    path: "/administrator/department/:type",
    name: "Add",
    component: FormDepartment,
  },
  {
    path: "/administrator/department",
    name: "Department",
    component: ListDepartment,
  },
  // ========================================================================
  {
    path: "/administrator/section/:type/:id",
    name: "Manage",
    component: FormSection,
  },
  { path: "/administrator/section/:type", name: "Add", component: FormSection },
  { path: "/administrator/section", name: "Section", component: ListSection },
  // ========================================================================
  // END OFF MENU MASTER

  {
    path: "/administrator/role_section/:type/:id",
    name: "Manage",
    component: FormRoleSection,
  },
  {
    path: "/administrator/role_section/:type",
    name: "Add",
    component: FormRoleSection,
  },
  {
    path: "/administrator/role_section",
    name: "Role Section",
    component: ListRoleSection,
  },

  // PUPPETEER
  // ========================================================================
  {
    path: "/puppeteer/puppeteer/:type/:id",
    name: "Manage",
    component: FormPuppeteer,
  },
  { path: "/puppeteer/puppeteer/:type", name: "Add", component: FormPuppeteer },
  { path: "/puppeteer/puppeteer", name: "Section", component: ListPuppeteer },
  // ========================================================================
  // END OFF MENU PUPPETEER
];

export default routes;
