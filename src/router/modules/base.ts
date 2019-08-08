const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/base/login/Login.vue")
  }
];

export default routes;
