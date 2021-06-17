<template>
  <Layout />
</template>

<script>
import { useStore } from 'vuex'
import Layout from './layout/Index.vue'

export default {
  components: {
    Layout,
  },
  setup() {
    const store = useStore()
    window.addEventListener('resize', () => {
      store.commit('setWindowInnerWidth')
    })
  },
}
</script>

<style lang="scss" src="./style/main.scss"></style>
