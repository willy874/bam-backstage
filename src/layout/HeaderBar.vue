<template>
  <div class="h-full flex items-center relative">
    <div class="px-3">
      <div class="flex justify-end" :style="{ width: `${barWidth}px` }">
        <div>
          <!-- <SelectDrop
            :model="{ text: '' }"
            field="text"
            placeholder="請選擇"
            :options="['測試', '測試文字', '測試很多字', '測試非常多字', '測試超級的多字']"
          ></SelectDrop> -->
        </div>
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
        <div class="px-4 py-1 border-b flex items-center">
          <Icon class="mr-2 text-blue-400" src="ProfileUser" size="24" />
          <span>{{ user.name }}</span>
        </div>
        <ul class="py-2 overflow-auto" style="max-height: calc((100vh - 48px) - 33px)">
          <li class="">
            <button type="button" class="py-1 px-4 w-full text-left hover:bg-primary-500 hover:text-primary-mirror" @click="logout">登出</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
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
    const user = reactive(
      admin.user || {
        name: '',
      }
    )
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
      logout: () => {
        admin.logout()
      },
    }
  },
  components: {
    Navbtn,
  },
}
</script>
