<template>
  <div class="mx-auto">
    <button class="btn-checkbox" :class="{ active: model.selected }" @click="changeEvent"></button>
  </div>
</template>

<script>
import { reactive, isReactive, markRaw } from 'vue'

export default markRaw({
  name: 'TableCheckbox',
  inheritAttrs: false,
  props: {
    listData: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
    changeSelected: {
      type: Function,
    },
  },
  setup(props) {
    const listData = isReactive(props.listData) ? props.listData : reactive(props.listData)
    const model = reactive(props.model)
    return {
      listData,
      model,
      changeEvent: (e) => {
        if (model.selected) {
          model.selected = false
        } else {
          model.selected = true
        }
        if (props.changeSelected) {
          props.changeSelected(e)
        }
      },
    }
  },
})
</script>
