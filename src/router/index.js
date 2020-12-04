import { createRouter, createWebHashHistory } from "vue-router";

import navRoute from "./nav-route";

// 路由配置从方法调用，变成了对象传递
const routes = navRoute.getPages();

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
