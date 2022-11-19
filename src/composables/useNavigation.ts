/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useNavigation() {
  const route = useRoute()
  const { t } = useI18n()

  const items = computed(() => [
    { title: t('menu.home'), icon: 'mdi-home', to: '/' },
    { title: t('menu.drumkit'), icon: 'mdi-apps', to: '/drumkit' },
    { title: t('menu.instrument'), icon: 'mdi-piano', to: '/instrument' },
    { title: t('menu.loops'), icon: 'mdi-autorenew', to: '/loops' },
    { title: t('menu.help'), icon: 'mdi-help-box', to: '/help' },
    { title: t('menu.about'), icon: 'mdi-information', to: '/about' },
    { title: t('dialog.upload'), icon: 'mdi-cloud-upload', to: '/upload' },
  ])

  const currentPageTitle = computed(() => {
    const item = items.value.find((e) => e.to === route.path)
    return item?.title
  })

  return { items, currentPageTitle }
}
