<template>
  <button type="button" class="text-blue-500 focus:outline-none" @click="click">
    <Icon src="Cloud" size="32" />
  </button>
</template>

<script>
import { reactive, isReactive, markRaw } from 'vue'
import { ListModel } from '@/models/index'
import { useDialog } from '@/components/dialog/index'
import ImageFolderDialog from './ImageFolderDialog.vue'

export default markRaw({
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
    fileLength: {
      type: [Number, String],
      validator: function (value) {
        if (Number(value) || Number(value) === 0) {
          return true
        }
      },
      default: 10,
    },
    modelHandler: {
      type: Function,
      default: async (p) => p,
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
            model: listModelData,
          },
        })
        const selectedImages = popup.props.selectedImages
        if (selectedImages && selectedImages.length) {
          if (selectedImages.length + listModelData.data.length > props.fileLength) {
            alert('上傳檔案數量超過上限')
          } else {
            const imageList = await Promise.all(
              selectedImages.map(async (image) => {
                image.edited = true
                return await props.modelHandler(image)
              })
            )
            imageList.forEach((image) => {
              listModelData.data.push(image)
            })
          }
        }
      },
    }
  },
})
</script>
