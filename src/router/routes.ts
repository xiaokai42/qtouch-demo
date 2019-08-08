import base from "@/router/modules/base";
import count from "@/router/modules/count";
import admin from "@/router/modules/admins";
import organization from "@/router/modules/organization";
import person from "@/router/modules/person";
import personCenter from "@/router/modules/personal_center";
import authority from "@/router/modules/authority";
import project from "@/router/modules/project";


const routes: Array<any> = [
  {
    path: "/",
    redirect: {
      name: "login"
    }
  },
  {
    path: "/root",
    name: "root",
    component: () => import("@/views/base/layout/Index.vue"),
    children: [...count, ...admin, ...organization, ...person, ...personCenter, ...authority, ...project]
  },
  {
    path: "/403",
    name: "403",
    component: () => import(/* webpackChunkName: "403" */ "@/views/base/error_page/403.vue")
  },
  {
    path: "/404",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "@/views/base/error_page/404.vue")
  },
  {
    path: "/500",
    name: "500",
    component: () => import(/* webpackChunkName: "500" */ "@/views/base/error_page/500.vue")
  },
  ...base
];

export default routes;
