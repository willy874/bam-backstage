<template>
  <div ref="container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUpdated, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

export default {
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const container = ref(null)
    const canvas = ref(null)
    const chart = ref(null)
    const canvasInit = () => {
      chart.value = echarts.init(canvas.value, null, {
        devicePixelRatio: 3,
        width: container.value.offsetWidth,
        height: container.value.offsetHeight,
        locale: 'ZH',
      })
      chart.value.setOption(props.options)
    }
    const canvasResize = () => {
      chart.value.resize()
      console.log(chart.value)
    }
    onMounted(() => {
      window.addEventListener('resize', canvasResize)
      canvasInit()
    })
    onUpdated(() => {
      canvasInit()
    })
    onUnmounted(() => {
      window.removeEventListener('resize', canvasResize)
    })
    return {
      canvas,
      chart,
      container,
    }
  },
}
</script>

<style lang="scss" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
