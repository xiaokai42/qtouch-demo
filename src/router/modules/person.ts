import Transfer from "@/views/base/layout/Transfer.vue";

const routes = [
  {
    path: "/personManage",
    name: "personManage",
    redirect: "noRedirect",
    component: Transfer,
    meta: {
      title: "人员管理",
      keepAlive: true
    },
    children: [
      {
        path: "/personCustomProps",
        name: "personCustomProps",
        meta: {
          title: "自定义属性管理",
          keepAlive: true
        },
        component: () => import("@/views/person/PersonCustomProps.vue")
      },
      {
        path: "/person",
        name: "person",
        meta: {
          title: "人员管理",
          keepAlive: true
        },
        component: () => import("@/views/person/PersonIndex.vue")
      }
    ]
  }
];

export default routes;
