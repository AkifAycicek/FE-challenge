import { createRouter, createWebHistory } from 'vue-router';
// Layouts
import LayoutDefault from '@/views/layouts/LayoutDefault.vue';
import LayoutDefaultPage from '@/views/layouts/LayoutDefaultPage.vue';

// Pages
import PlayGround from '@/views/pages/PlayGround.vue';
import LandingPage from '@/views/pages/LandingPage.vue';
import ListPage from '@/views/pages/ListPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)',
      redirect: '/',
    },
    {
      path: '/',
      component: LayoutDefault,
      children: [
        {
          path: '',
          name: 'LandingPage',
          component: LandingPage,
        },
        {
          path: '',
          component: LayoutDefaultPage,
          children: [
            {
              path: 'list',
              name: 'ListPage',
              component: ListPage,
            },
          ],
        },
        {
          path: 'playground',
          name: 'PlayGround',
          component: PlayGround,
        },
      ],
    },
  ],
});

if (process.env.NODE_ENV != 'development') router.removeRoute('PlayGround');

export default router;
