<template>
  <div class="breadcrumb">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__list__first">
        <RouterLink class="breadcrumb__list__item__link" to="/">首頁</RouterLink>
      </li>
      <li class="breadcrumb__list__item" v-for="route in breadcrumb" :key="route.path">
        <div class="breadcrumb__list__item__arrow"></div>
        <RouterLink class="breadcrumb__list__item__link" :class="{ 'breadcrumb__list__item__link--active': route.active }" :to="route.path">
          {{ route.title }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'Breadcrumb',
  setup() {
    const router = useRouter()
    const breadcrumb = router.currentRoute.value.matched
      .map((route) => {
        if (route.props && route.props.default) {
          const routeProps = route.props.default
          if (route.path === '/') {
            return null
          }
          return {
            path: route.path,
            title: routeProps.routeTitle,
            active: router.currentRoute.value.path === route.path,
          }
        }
        return null
      })
      .filter((r) => r)
    return {
      breadcrumb: reactive(breadcrumb),
    }
  },
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  font-size: 14px;
  &__list {
    display: flex;
    &__first {
      padding: 0;
    }
    &__item {
      display: flex;
      align-items: center;
      padding-left: 1rem;
      &__arrow {
        width: 1rem;
        height: 1rem;
        border-color: transparent #17a2b8 #17a2b8 transparent;
        border-width: 4px;
        border-radius: 0.125rem;
        transform: translateX(-50%) rotate(-45deg) scale(0.5);
      }
      &__link {
        &--active {
          font-weight: bold;
        }
        &:hover {
          color: #17a2b8;
        }
      }
    }
  }
}
</style>
