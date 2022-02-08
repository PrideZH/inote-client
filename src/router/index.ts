import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router';

import HomeLayout from '@/layout/homeLayout/index.vue';
import IndexLayout from '@/layout/indexLayout/index.vue';
import ExploreLayout from '@/layout/exploreLayout/index.vue';

const routes: Array<RouteRecordRaw> = [
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
  },
  {
    path: '/',
    component: ExploreLayout,
    redirect: 'explore',
    children: [
      {
        name: 'explore',
        path: 'explore',
        component: () => import('@/views/explore/index.vue')
      },
      {
        name: 'account',
        path: 'account',
        component: () => import('@/views/account/index.vue'),
        redirect: '/account/home',
        children: [
          {
            path: 'home',
            component: () => import('@/views/account/home/index.vue')
          },
          {
            path: 'info',
            component: () => import('@/views/account/info/index.vue')
          },
          {
            path: 'avatar',
            component: () => import('@/views/account/avatar/index.vue')
          }
        ]
      },
      {
        name: 'setting',
        path: 'setting',
        component: () => import('@/views/setting/index.vue'),
        redirect: '/setting/picbed',
        children: [
          {
            path: 'picbed',
            component: () => import('@/views/setting/picbed/index.vue')
          }
        ]
      }
    ]
  },

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

export const push = (path: string, query?: object) => {
  router.push(path);
};

/**
 * 新开标签页
 */
export const openBlank = (path: string) => {
  const routeUrl = router.resolve({
    path, query: {}
  });
  window.open(routeUrl.href, '_blank');
};
