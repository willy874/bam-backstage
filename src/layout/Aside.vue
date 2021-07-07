<template>
  <div
    class="bg-primary-500 h-full flex-shrink-0 border-r z-10 transform"
    @transitionend="transitionend"
    :style="{
      transition: 'all 0.3s',
      willChange: 'auto',
      width: !global.asideShow && global.windowInnerWidth > deviceSwitch ? `${global.iconWidth + 16}px` : `${asideWidth}px`,
      position: global.windowInnerWidth < deviceSwitch ? 'fixed' : 'relative',
      '--tw-translate-x': global.windowInnerWidth < deviceSwitch && !global.asideShow ? `-100%` : 0,
    }"
  >
    <div class="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col">
      <aside id="aside" class="flex flex-col flex-grow">
        <div class="flex-shrink-0">
          <slot name="header"></slot>
        </div>
        <div class="flex-grow">
          <slot name="default"></slot>
        </div>
        <div class="flex-shrink-0">
          <slot name="footer"></slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import config from '@/config/index'
// import Navbar from './Navbar.vue'

export default {
  name: 'Aside',
  setup() {
    const store = useStore()
    const router = useRouter()
    const routes = reactive(router.getRoutes())
    const navRoutes = computed(() => routes)
    return {
      navRoutes,
      asideWidth: ref(config.layout.asideWidth),
      deviceSwitch: ref(config.layout.deviceSwitch),
      global: ref(store.state.global),
      transitionend: (e) => {
        if (e.propertyName === 'width') {
          class ToggleAsideEvent extends TransitionEvent {}
          window.dispatchEvent(
            new ToggleAsideEvent('toggleAsideEnd', {
              bubbles: false,
              cancelable: false,
            })
          )
        }
      },
    }
  },
  components: {
    // Navbar,
  },
}
</script>
