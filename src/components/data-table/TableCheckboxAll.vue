<template>
  <div class="d-flex flex-center w-100">
    <div>
      <button v-if="listData.data.length" class="btn btn-checkbox" :class="{ active: checked }" @click="changeEvent"></button>
      <span v-else>#</span>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { v4 as uuid } from 'uuid'

export default markRaw({
  inheritAttrs: false,
  name: 'TableCheckboxAll',
  props: {
    selecteList: {
      type: Array,
      default: () => [],
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
      if (this.listData.data.length === value.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
  },
  methods: {
    changeEvent() {
      const selecteList = this.selecteList
      if (this.listData.data.length === this.value.length) {
        selecteList.splice(0)
      } else {
        this.listData.data.forEach((item) => {
          if (!selecteList.includes(item)) {
            selecteList.push(item)
          }
        })
      }
    },
  },
})
</script>
