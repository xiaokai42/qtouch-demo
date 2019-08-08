import Transfer from "@/views/base/layout/Transfer.vue";
const routers = [
  {
    name:"personCenter",
    path:"personCenter",
    redirect: "noRedirect",
    component: Transfer,
    meta: {
      title: "个人中心",
      keepAlive: false
    },
    children: [
      {
        path: "/mine",
        name: "Mine",
        meta: {
          title: "个人信息",
          keepAlive: true
        },
        component:()=> import("@/views/personal_center/Index.vue")
      },
      {
        path:"/changePassword",
        name:"ChangePass",
        meta: {
          title: "密码修改",
          keepAlive: true
        },
        component:()=> import("@/views/personal_center/ChangePass.vue")
      }
    ]
  }
];

export default routers;
