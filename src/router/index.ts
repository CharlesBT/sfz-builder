/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/drumkit',
      name: 'drumkit',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/DrumkitPage.vue'),
    },
    {
      path: '/instrument',
      name: 'instrument',
      component: () => import('../pages/InstrumentPage.vue'),
    },
    {
      path: '/loops',
      name: 'loops',
      component: () => import('../pages/LoopsPage.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../pages/HelpPage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutPage.vue'),
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../pages/UploadTestPage.vue'),
    },
  ],
})

export default router
