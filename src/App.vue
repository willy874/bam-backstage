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
    document.addEventListener('click', () => {
      store.commit('setHeaderShow', false)
    })
  },
}
</script>

<style lang="scss" src="./style/main.scss"></style>
