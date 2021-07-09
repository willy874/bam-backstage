<template>
  <button type="button" class="text-blue-500 focus:outline-none" @click="click">
    <Icon src="Cloud" size="32" />
  </button>
</template>

<script>
import { reactive, isReactive } from 'vue'
import { ListModel } from '@/models/index'
import { useDialog } from '@/components/dialog/index'
import ImageFolderDialog from './ImageFolderDialog.vue'

export default {
  name: 'ImageFolderButton',
  inheritAttrs: false,
  props: {
    listModelData: {
      type: ListModel,
      default: () => null,
    },
    filterList: {
      type: Object,
      default: () => null,
    },
    selecteList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const listModelData = isReactive(props.listModelData) ? props.listModelData : reactive(props.listModelData)
    return {
      click: async () => {
        const dialog = useDialog()
        const popup = await dialog.popup(ImageFolderDialog, {
          width: '768px',
          props: {
            listModelData,
          },
        })
        const selectedImages = popup.props.selectedImages
        if (selectedImages && selectedImages.length) {
          selectedImages.forEach((image) => {
            listModelData.data.push(image)
          })
        }
      },
    }
  },
}
</script>
