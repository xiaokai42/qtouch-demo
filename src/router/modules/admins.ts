import Transfer from "@/views/base/layout/Transfer.vue";

const routes = [
  {
    path: "/adminMenu",
    name: "adminMenu",
    redirect: "noRedirect",
    component: Transfer,
    meta: {
      title: "管理员菜单",
      keepAlive: true
    },
    children: [
      {
        path: "/base_type_manage",
        name: "BaseTypeManage",
        meta: {
          keepAlive: true,
          title: "基础属性类型管理"
        },
        component: () => import("@/views/admins/base_type_manage/Index.vue")
      },
      {
        path: "/person_manage",
        name: "PersonManage",
        meta: {
          keepAlive: true,
          title: "人员管理"
        },
        component: () => import("@/views/admins/person_manage/Index.vue")
      },
      {
        path: "/process",
        name: "Process",
        meta: {
          keepAlive: true,
          title: "流程管理"
        },
        component: () => import("@/views/admins/process_manage/ProcessIndex.vue")
      },
      {
        path: "/form_manage",
        name: "FormManage",
        meta: {
          keepAlive: true,
          title: "表单管理"
        },
        component: () => import("@/views/admins/form_manage/FormManage.vue")
      }
    ]
  }
];

export default routes;
