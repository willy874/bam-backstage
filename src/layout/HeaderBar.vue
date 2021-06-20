<template>
  <div class="h-full flex items-center relative">
    <div class="px-3">
      <div class="flex justify-end" :style="{ width: `${barWidth}px` }">
        <div></div>
      </div>
    </div>
    <div class="px-3" @click.stop>
      <Navbtn state-name="headerShow" commit="setHeaderShow" class="text-primary-500" />
    </div>
    <div
      class="absolute top-full right-0 z-10 overflow-hidden shadow-lg"
      @click.stop
      :style="{ transition: 'all 0.4s', maxHeight: global.headerShow ? 'calc(100vh - 48px)' : '0' }"
    >
      <div class="border py-1 bg-primary-mirror">
        <div class="px-4 py-1 border-b">{{ user.name }}</div>
        <ul class="py-2 overflow-auto" style="max-height: calc((100vh - 48px) - 33px)">
          <li class="">
            <button type="button" class="py-1 px-4 w-full text-center hover:bg-primary-500 hover:text-primary-mirror">登出</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useAdmin } from '@/admin/index'
import Navbtn from './Navbtn.vue'

export default {
  name: 'HeaderBar',
  props: {
    plugins: {
      type: Array,
    },
  },
  setup() {
    const admin = useAdmin()
    const { user } = admin
    const getBarWidth = () => window.innerWidth - (240 + 73)
    const barWidth = ref(getBarWidth())
    const resizeEvent = () => {
      barWidth.value = getBarWidth()
    }
    onMounted(() => {
      window.addEventListener('resize', resizeEvent)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', resizeEvent)
    })
    const filterBtn = computed(() => {
      return []
    })
    const store = useStore()
    return {
      global: ref(store.state.global),
      barWidth,
      filterBtn,
      user,
    }
  },
  components: {
    Navbtn,
  },
}
</script>
