<template>
  <div class="d-flex flex-center w-100">
    <div>
      <button class="btn btn-checkbox" :class="{ active: checked }" @click="changeEvent"></button>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid'

export default {
  name: 'TableCheckbox',
  props: {
    selecteList: {
      type: Array,
      default: () => [],
    },
    listIndex: {
      type: Number,
      required: true,
    },
    listData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uuid: uuid(),
      checked: false,
    }
  },
  watch: {
    selecteList(value) {
      const model = this.listData.data[this.listIndex]
      if (value.includes(model)) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
  },
  methods: {
    changeEvent(e) {
      const model = this.listData.data[this.listIndex]
      const selecteList = this.selecteList
      if (selecteList.includes(model)) {
        const index = this.value.indexOf(model)
        selecteList.splice(index, 1)
      } else {
        this.value.push(model)
      }
    },
  },
}
</script>
