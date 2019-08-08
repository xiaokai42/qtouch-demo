const routes = [
  {
    path: "/root",
    name: "home",
    component: () => import("@/views/home/Home.vue")
  }
];

export default routes;
