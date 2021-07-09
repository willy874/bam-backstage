<template>
  <Layout />
  <Dialog />
</template>

<script>
import { useStore } from 'vuex'
import Layout from './layout/Index.vue'

export default {
  components: {
    Layout,
  },
  created() {
    const store = useStore()
    window.addEventListener('resize', () => {
      store.commit('setWindowInnerWidth')
    })
    document.querySelector('#app').addEventListener('click', () => {
      store.commit('setHeaderShow', false)
      store.commit('clearImageAssetsSelected', false)
    })
  },
}
</script>

<style lang="scss" src="./style/main.scss"></style>
