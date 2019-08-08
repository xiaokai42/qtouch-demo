import Transfer from "@/views/base/layout/Transfer.vue";

const routes = [
  {
    path: "/authorityModule",
    name: "authorityModule",
    redirect: "noRedirect",
    component: Transfer,
    meta: {
      title: "权限管理模块",
      keepAlive: true
    },
    children: [
      {
        path: "/subsystem",
        name: "subsystem",
        meta: {
          title: "子系统",
          keepAlive: true
        },
        component: () => import("@/views/authority/Subsystem.vue")
      },
      {
        path: "/interfaceManagement",
        name: "interfaceManagement",
        meta: {
          title: "接口管理",
          keepAlive: true
        },
        component: () => import("@/views/authority/InterfaceManagement.vue")
      },
      {
        path: "/functionalOperation",
        name: "functionalOperation",
        meta: {
          title: "功能操作",
          keepAlive: true
        },
        component: () => import("@/views/authority/FunctionalOperation.vue")
      },
      {
        path: "/systemMenu",
        name: "systemMenu",
        meta: {
          title: "系统菜单",
          keepAlive: true
        },
        component: () => import("@/views/authority/SystemMenu.vue")
      },
      {
        path: "/teamManagement",
        name: "teamManagement",
        meta: {
          title: "团队管理",
          keepAlive: true
        },
        component: () => import("@/views/authority/TeamManagement.vue")
      },
      {
        path: "/roleManagement",
        name: "roleManagement",
        meta: {
          title: "角色管理",
          keepAlive: true
        },
        component: () => import("@/views/authority/RoleManagement.vue")
      }
    ]
  }
];

export default routes;
