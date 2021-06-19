<template>
  <nav>
    <ul class="overflow-hidden">
      <li class="text-primary-mirror py-1" v-for="item in nav" :key="item.uuid">
        <div class="relative flex items-center bg-white bg-opacity-0 hover:bg-opacity-40">
          <template v-if="item.route && hasRoute(item.route.name)">
            <div class="flex flex-grow items-center relative">
              <div class="flex-shrink-0 p-2">
                <Icon v-if="item.icon" :src="item.icon" :size="global.iconWidth" />
                <div v-else :style="{ width: `${global.iconWidth}px` }"></div>
              </div>
              <div class="flex-grow px-2 overflow-hidden">
                <RouterLink class="stretched-link whitespace-nowrap" :to="item.route">{{ item.title }}</RouterLink>
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
              <a class="stretched-link whitespace-nowrap" href="javascript:;" @click="toggleItem(item)">{{ item.title }}</a>
            </div>
            <div class="flex-shrink-0 px-1">
              <template v-if="item.children && item.children.length">
                <Icon class="transition transform scale-50" :class="{ '-rotate-90': !item.open }" src="Arrow" :size="global.iconWidth" />
              </template>
            </div>
          </template>
        </div>
        <ul class="pb-2" v-if="item.children && item.children.length && item.open">
          <li class="relative py-2 flex bg-white bg-opacity-20 hover:bg-opacity-40" v-for="child in item.children" :key="child.uuid">
            <div class="flex-shrink-0 p-2">
              <Icon v-if="child.icon" :src="child.icon" :size="global.iconWidth" />
              <div v-else :style="{ width: `${global.iconWidth}px` }"></div>
            </div>
            <div class="flex-grow px-2">
              <template v-if="child.route">
                <RouterLink class="stretched-link whitespace-nowrap" :to="child.route">{{ child.title }}</RouterLink>
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
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const navMiddleware = (config) => {
      return config.map((model) => {
        return {
          uuid: uuid(),
          open: false,
          ...model,
          children: model.children
            ? model.children.map((child) => {
                return {
                  uuid: uuid(),
                  ...child,
                }
              })
            : [],
        }
      })
    }
    return {
      nav: reactive(navMiddleware(props.config)),
      global: ref(store.state.global),
      toggleItem: (item) => {
        item.open = !item.open
      },
      hasRoute: router.hasRoute,
    }
  },
}
</script>
