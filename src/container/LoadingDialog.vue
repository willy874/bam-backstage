<template>
  <div ref="root" tabindex="0" data-name="DialogLayout" class="flex items-center justify-center h-screen w-screen">
    <main class="p-4 w-60 max-w-full">
      <div class="bg-white p-6 rounded-lg shadow-2xl text-center">
        <div v-if="title" v-text="title" class="text-2xl font-bold mb-3 text-gray-700"></div>
        <div v-if="text" v-text="text" class="py-2"></div>
        <div v-if="html" v-html="html" class="py-2"></div>
        <div class="py-1">{{ index.value }}/{{ count.value }}</div>
        <div class="rounded bg-primary-100">
          <div class="transition duration-300 rounded-full h-2 bg-primary-500" :style="{ width: `${100 * (index.value / count.value)}%` }"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { watch } from 'vue'

export default {
  name: 'DialogLayout',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  setup(props) {
    watch(
      () => props.props.index.value,
      (value) => {
        if (value === props.props.count.value) {
          props.dialog.closePopup(props.id)
        }
      }
    )
    return {
      title: props.props.title,
      text: props.props.text,
      html: props.props.html,
      index: props.props.index,
      count: props.props.count,
    }
  },
}
</script>
