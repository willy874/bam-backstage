<template>
  <div class="d-flex flex-column flex-fill transform" :class="[`router-${transition}`]">
    <header v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <div class="scroll-panel flex-grow-1">
      <slot name="default"></slot>
    </div>
    <footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
/**
 * 於 page 設定 beforeRouteEnter 來進行不同的 transition 動畫。
 * @example
 * ```js
 * beforeRouteEnter(to, from, next) {
 *  to.meta.enter = 'transition-name'
 *  from.meta.leave = 'transition-name'
 *  window.requestAnimationFrame(next)
 * }
 * ```
 */
export default {
  name: 'PageLayout',
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      transition: 'fade',
    }
  },
  created() {
    this.transition = this.$route.meta.enter || 'fade'
  },
  mounted() {
    const transitionEvent = () => {
      this.transition = this.$route.meta.leave || 'fade'
      this.$el.removeEventListener('transitionend', transitionEvent)
      this.$el.removeEventListener('transitioncancel', transitionEvent)
    }
    this.$el.addEventListener('transitionend', transitionEvent)
    this.$el.addEventListener('transitioncancel', transitionEvent)
  },
}
</script>
