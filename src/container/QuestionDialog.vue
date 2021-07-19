<template>
  <DialogLayout v-bind="$props" title="說明">
    <template #navbar> </template>
    <div v-html="content"></div>
    <template #footer>
      <div class="flex flex-wrap justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-1"></div>
        <div class="px-1 flex flex-wrap items-center">
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">關閉</button>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { ref } from 'vue'
import throttle from 'lodash/throttle'
import DialogLayout from '@/container/DialogLayout.vue'

export default {
  name: 'QuestionDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const content = ref(props.props.content)
    return {
      content,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }),
    }
  },
}
</script>
