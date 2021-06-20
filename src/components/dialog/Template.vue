<template>
  <div class="bg-white p-3 rounded-lg shadow-2xl border">
    <button class="m-2" type="button" draggable="true" @dragstart="drag" @touchstart="touch" style="cursor: grab">我要拖曳</button>
    <button class="m-2" type="button" @click="open">多開一個</button>
  </div>
</template>

<script>
import { useDialog } from '@/components/dialog/index'

const DialogTemplate = {
  name: 'Template',
  props: ['drag', 'touch', 'updated', 'props', 'id', 'popupElement', 'dialog'],
  setup(props) {
    const dialog = useDialog()
    return {
      open: () => {
        console.log(props)
        dialog.popup(DialogTemplate, {})
      },
    }
  },
}

export default DialogTemplate
</script>
