<template>
  <button class="btn-icon text-primary-500 hover:text-primary-600" @click="click">
    <Icon src="PointSymbol" size="24" />
  </button>
</template>

<script>
import { useDialog } from '@/components/dialog/index'
import LinePointCreateDialog from './LinePointCreateDialog.vue'

export default {
  name: 'LinePointButton',
  inheritAttrs: false,
  setup(props, context) {
    const dialog = useDialog()
    return {
      click: async () => {
        const popup = await dialog.popup(LinePointCreateDialog, {
          width: '576px',
          props: context.attrs,
        })
        console.log(popup)
      }
    }
  },
}
</script>
