import Transfer from "@/views/base/layout/Transfer.vue";

const routes = [
  {
    path: "/project",
    name: "project",
    redirect: "noRedirect",
    component: Transfer,
    meta: {
      title: "项目管理模块",
      keepAlive: true
    },
    children: [
      {
        path: "/projectList",
        name: "projectSearch",
        meta: {
          title: "项目查询",
          keepAlive: true
        },
        component: () => import("@/views/project/ProjectList.vue")
      }
    ]
  }
];

export default routes;
