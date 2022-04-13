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
      }
    ]
  },
  {
    name: 'edit',
    path: '/index/edit',
    component: () => import('@/views/index/editMobile/index.vue'),
    meta: {
      mobile: true
    }
  },
  {
    path: '/',
    component: ExploreLayout,
    redirect: 'explore',
    meta: {
      title: '社区 · inote'
    },
    children: [
      {
        name: 'explore',
        path: 'explore',
        component: () => import('@/views/explore/index.vue')
      },
      {
        name: 'space',
        path: 'space/:id',
        component: () => import('@/views/space/index.vue'),
        meta: {
          title: '个人空间 · inote'
        },
        children: [
          {
            path: '',
            component: () => import('@/views/space/article/index.vue')
          },
          {
            path: 'moment',
            component: () => import('@/views/space/moment/index.vue')
          },
          {
            path: 'collection',
            component: () => import('@/views/space/collection/index.vue')
          },
          {
            path: 'setting',
            component: () => import('@/views/space/setting/index.vue')
          }
        ]
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
        name: 'message',
        path: 'message',
        component: () => import('@/views/message/index.vue'),
        redirect: '/message/reply',
        meta: {
          title: '消息中心 · inote'
        },
        children: [
          {
            path: 'reply',
            component: () => import('@/views/message/reply/index.vue')
          },
          {
            path: 'system',
            component: () => import('@/views/message/system/index.vue')
          },
          {
            path: 'whisper',
            component: () => import('@/views/message/whisper/index.vue')
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
  window.open(path, '_blank');
};
