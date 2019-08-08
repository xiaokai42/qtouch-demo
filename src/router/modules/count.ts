import Transfer from "@/views/base/layout/Transfer.vue";

const routes = [
  {
    path: "/countMenu",
    name: "countMenu",
    redirect: "noRedirect",
    component: Transfer,
    meta: {
      title: "统计管理",
      keepAlive: true
    },
    children: [
      {
        path: "/root",
        name: "count",
        meta: {
          title: "消防审查统计",
          keepAlive: true
        },
        component: () => import("@/views/count/Count.vue")
      }
    ]
  }
];

export default routes;
