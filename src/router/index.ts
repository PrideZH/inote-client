import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router';

import HomeLayout from '@/layout/homeLayout/index.vue';
import IndexLayout from '@/layout/indexLayout/index.vue';
import ExploreLayout from '@/layout/exploreLayout/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/home',
    component: HomeLayout,
    meta: {
      title: '首页 · inote'
    },
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
    meta: {
      title: '工作台 · inote'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/index/index.vue')
      },
      {
        name: 'images',
        path: 'images',
        component: () => import('@/views/images/index.vue'),
      },
      {
        name: 'setting',
        path: 'setting',
        component: () => import('@/views/setting/index.vue'),
        redirect: '/index/setting/picbed',
        children: [
          {
            path: 'picbed',
            component: () => import('@/views/setting/picbed/index.vue')
          }
        ]
      },
    ]
  },
  {
    path: '/',
    component: ExploreLayout,
    redirect: 'explore',
    meta: {
      title: '探索 · inote'
    },
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
        meta: {
          title: '个人中心 · inote'
        },
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
        name: 'publish',
        path: 'publish',
        component: () => import('@/views/publish/index.vue'),
        redirect: '/publish/home',
        meta: {
          title: '文章中心 · inote'
        },
        children: [
          {
            path: 'home',
            component: () => import('@/views/publish/home/index.vue')
          },
          {
            path: 'upload/:id',
            component: () => import('@/views/publish/upload/index.vue')
          },
          {
            path: 'article/:id',
            component: () => import('@/views/publish/article/index.vue')
          },
          {
            path: 'note-manager',
            component: () => import('@/views/publish/noteManager/index.vue')
          },
          {
            path: 'article-manager',
            component: () => import('@/views/publish/articleManager/index.vue')
          },
          {
            path: 'comment-manager',
            component: () => import('@/views/publish/commentManager/index.vue')
          }
        ]
      },
    ]
  },
  {
    name: 'article',
    path: '/article/:id',
    component: () => import('@/views/article/index.vue')
  },
  {
    name: 'comment',
    path: '/article/:id/comment',
    component: () => import('@/views/comment/index.vue')
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

router.beforeEach((to, from, next) => {
  // 页面标题
  const title: string | undefined = to.meta.title as string;
  if (title) {
    document.title = title;
  }
  next();
});

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
