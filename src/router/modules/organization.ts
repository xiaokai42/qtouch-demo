import Transfer from "@/views/base/layout/Transfer.vue";

const routes = [
  {
    path: "/orgManage",
    name: "orgManage",
    redirect: "noRedirect",
    component: Transfer,
    meta: {
      title: "组织机构管理",
      keepAlive: true
    },
    children: [
      {
        path: "/organizationCustomProps",
        name: "organizationCustomProps",
        meta: {
          title: "自定义属性管理",
          keepAlive: true
        },
        component: () => import("@/views/organization/OrganizationCustomProps.vue")
      },
      {
        path: "/organization_manage",
        name: "OrgManage",
        meta: {
          title: "组织机构管理",
          keepAlive: true
        },
        component: () => import("@/views/organization/Organization.vue")
      }
    ]
  }
];

export default routes;
