<template>
  <div id="layout" class="overflow-hidden">
    <Header>
      <template #left>
        <div
          class="flex items-center"
          :style="{
            width: `${asideWidth}px`,
          }"
        >
          <div class="px-3 flex-shrink-0" v-show="global.windowInnerWidth < deviceSwitch">
            <Navbtn />
          </div>
          <div class="flex-grow px-3 py-1">
            <img class="h-10" src="../assets/logo-light.png" alt="" />
          </div>
        </div>
      </template>
    </Header>
    <div class="flex flex-grow relative">
      <Aside>
        <template #header>
          <div class="px-1 py-2" v-show="global.windowInnerWidth > deviceSwitch">
            <Navbtn class="text-white" />
          </div>
        </template>
        <div>456</div>
        <template #footer>
          <div>789</div>
        </template>
      </Aside>
      <main class="h-full flex-grow relative">
        <div class="absolute inset-0 overflow-auto">
          <RouterView v-slot="{ Component, route }">
            <transition :name="route.meta.transition || 'fade'">
              <keep-alive>
                <component :is="Component" :key="route.name" />
              </keep-alive>
            </transition>
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import config from '@/config/index'
import Header from './Header.vue'
import Aside from './Aside.vue'
import Navbtn from './Navbtn.vue'

export default {
  name: 'Layout',
  setup() {
    const store = useStore()

    return {
      global: ref(store.state.global),
      asideWidth: ref(config.layout.asideWidth),
      deviceSwitch: ref(config.layout.deviceSwitch),
    }
  },
  components: {
    Header,
    Aside,
    Navbtn,
  },
}
</script>
