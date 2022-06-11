import { createRouter, createWebHistory } from 'vue-router';
// Layouts
import LayoutDefault from '@/views/layouts/LayoutDefault.vue';

// Pages
import PlayGround from '@/views/pages/PlayGround.vue';

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
