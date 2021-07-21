<template>
  <nav>
    <ul class="overflow-hidden">
      <li class="text-primary-mirror" v-for="item in nav" :key="item.id">
        <div class="relative flex items-center bg-white bg-opacity-0 hover:bg-opacity-40">
          <template v-if="item.route">
            <div class="flex flex-grow items-center relative">
              <div class="flex-shrink-0 p-2">
                <Icon v-if="item.icon" :src="item.icon" :size="global.iconWidth" />
                <div v-else :style="{ width: `${global.iconWidth}px` }"></div>
              </div>
              <div class="flex-grow px-2 overflow-hidden">
                <RouterLink class="stretched-link whitespace-nowrap block pl-6" :to="item.route">{{ item.title }}</RouterLink>
              </div>
            </div>
            <div class="flex-shrink-0 px-1">
              <template v-if="item.children && item.children.length">
                <a class="stretched-link" href="javascript:;" @click="toggleItem(item)">
                  <Icon class="transition transform scale-50" :class="{ '-rotate-90': !item.open }" src="Arrow" :size="global.iconWidth" />
                </a>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="flex-shrink-0 p-2">
              <Icon v-if="item.icon" :src="item.icon" :size="global.iconWidth" />
              <div v-else :style="{ width: `${global.iconWidth}px` }"></div>
            </div>
            <div class="flex-grow px-2 overflow-hidden">
              <a class="stretched-link whitespace-nowrap block pl-6" href="javascript:;" @click="toggleItem(item)">{{ item.title }}</a>
            </div>
            <div class="flex-shrink-0 px-1">
              <template v-if="item.children && item.children.length">
                <Icon class="transition transform scale-50" :class="{ '-rotate-90': !item.open }" src="Arrow" :size="global.iconWidth" />
              </template>
            </div>
          </template>
        </div>
        <ul v-if="item.children && item.children.length && item.open">
          <li class="relative py-2 flex bg-white bg-opacity-20 hover:bg-opacity-40" v-for="child in item.children" :key="child.id">
            <div class="flex-shrink-0 p-2">
              <Icon v-if="child.icon" :src="child.icon" :size="global.iconWidth" />
              <div v-else :style="{ width: `${global.iconWidth}px` }"></div>
            </div>
            <div class="flex-grow px-2">
              <template v-if="child.route">
                <RouterLink class="stretched-link whitespace-nowrap block pl-6" :to="child.route">{{ child.title }}</RouterLink>
              </template>
              <template v-else>
                <a href="javascript:;">{{ child.title }}</a>
              </template>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'

export default {
  name: 'Navbar',
  props: {
    config: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const navMiddleware = () => {
      return props.config
        .filter((model) => {
          // 過濾不存在的 route
          if (model.route && router.hasRoute(model.route.name)) {
            return true
          }
          if (model.children && model.children.some((m) => router.hasRoute(m.route.name))) {
            return true
          }
        })
        .map((model) => {
          // 過濾不存在的 children route
          const children = model.children ? model.children.filter((m) => m.route && router.hasRoute(m.route.name)) : []
          // 當只有一個子選項卻沒有 route
          if (children.length === 1) {
            return {
              id: model.id || uuid(),
              open: model.open || false,
              ...model,
              route: children[0].route,
              children: undefined,
            }
          }
          return {
            id: model.id || uuid(),
            open: model.open || false,
            ...model,
            children: children.map((child) => {
              return {
                id: model.id || uuid(),
                ...child,
              }
            }),
          }
        })
    }
    const nav = reactive(navMiddleware(props.config))
    store.commit('setNav', nav)

    return {
      nav,
      global: ref(store.state.global),
      toggleItem: (item) => {
        item.open = !item.open
        if (item.open === true) {
          store.commit('setAsideShow', true)
        }
      },
    }
  },
}
</script>
