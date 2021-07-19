<template>
  <button class="btn-icon text-primary-500 hover:text-primary-600" @click="click">
    <Icon src="Megaphone" size="24" />
  </button>
</template>

<script>
import { markRaw } from 'vue'
import { useDialog } from '@/components/dialog/index'
import LinePushOptionDialog from './OptionDialog.vue'

export default markRaw({
  name: 'LinePushTableOptionButton',
  inheritAttrs: false,
  setup(props, context) {
    const dialog = useDialog()
    return {
      click: () => {
        dialog.popup(LinePushOptionDialog, {
          width: '576px',
          props: {
            ...context.attrs,
          },
        })
      },
    }
  },
})
</script>
