<template>
  <button class="btn-icon text-primary-500 hover:text-primary-600" @click="click">
    <Icon src="PointSymbol" size="24" />
  </button>
</template>

<script>
import { markRaw } from 'vue'
import { useDialog } from '@/components/dialog/index'
import LinePointCreateDialog from './CreateDialog.vue'

export default markRaw({
  name: 'LinePointTableOptionButton',
  inheritAttrs: false,
  setup(props, context) {
    const dialog = useDialog()
    return {
      click: () => {
        dialog.popup(LinePointCreateDialog, {
          width: '576px',
          props: context.attrs,
        })
      },
    }
  },
})
</script>
