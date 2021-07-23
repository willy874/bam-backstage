<template>
  <div id="layout" class="overflow-hidden">
    <Header>
      <template #left>
        <div class="flex items-center" :style="{ width: `${asideWidth}px` }">
          <div class="px-3 flex-shrink-0" v-show="global.windowInnerWidth < deviceSwitch">
            <Navbtn state-name="asideShow" commit="setAsideShow" />
          </div>
          <div class="flex-grow px-3 py-1">
            <img class="h-10" src="../assets/logo-light.png" alt="" />
          </div>
        </div>
      </template>
      <template #right>
        <HeaderBar />
      </template>
    </Header>
    <div class="flex flex-grow relative">
      <Aside v-if="isLogin">
        <template #header>
          <div class="p-2" v-show="global.windowInnerWidth > deviceSwitch">
            <Navbtn state-name="asideShow" commit="setAsideShow" template="rotate" class="text-primary-mirror" />
          </div>
        </template>
        <div>
          <Navbar :config="navbarConfig" />
        </div>
        <template #footer>
          <div></div>
        </template>
      </Aside>
      <main class="h-full flex-grow relative">
        <RouterView v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'">
            <component :is="Component" :key="route.name" />
          </transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useAdmin } from '@/admin/index'
import config from '@/config/index'
import Header from './Header.vue'
import HeaderBar from './HeaderBar.vue'
import Aside from './Aside.vue'
import Navbar from './Navbar.vue'
import Navbtn from './Navbtn.vue'
import navbarConfig from './navbar.config'

export default {
  name: 'Layout',
  setup() {
    const store = useStore()
    const admin = useAdmin()
    const isLogin = admin.isLogin
    return {
      isLogin,
      navbarConfig,
      global: ref(store.state.global),
      asideWidth: ref(config.layout.asideWidth),
      deviceSwitch: ref(config.layout.deviceSwitch),
    }
  },
  components: {
    Header,
    HeaderBar,
    Aside,
    Navbar,
    Navbtn,
  },
}
</script>
