import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router';

import HomeLayout from '@/layout/homeLayout/index.vue';
import IndexLayout from '@/layout/indexLayout/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'home',
  },
  {
    name: 'home',
    path: '/home',
    component: HomeLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'login',
        component: () => import('@/views/login/index.vue')
      }
    ]
  },
  {
    name: "index",
    path: "/index",
    component: IndexLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/index/index.vue')
      },
    ]
  }
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'notFound',
  //   component: () => import('@/views/not-found/index.vue'),
  // },
];

const router: Router = createRouter({
  history: createWebHistory("/"),
  routes
});

export default router;
