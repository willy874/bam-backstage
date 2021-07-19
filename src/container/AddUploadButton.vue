<template>
  <div class="py-1">
    <input :id="uuid" class="hidden" type="file" multiple @change="change" />
    <label :for="uuid" class="relative text-primary-500 hover:text-primary-600 block w-6 h-6 cursor-pointer">
      <Icon class="absolute top-0 left-0" src="Add" size="24" />
    </label>
  </div>
</template>

<script>
import { reactive, isReactive } from 'vue'
import { v4 as uuid } from 'uuid'
import { ListModel } from '@/models/index'
import { checkFile, checkFileErrorMessage } from '@/utility/file'

export default {
  name: 'AddUploadButton',
  inheritAttrs: false,
  props: {
    listModelData: {
      type: ListModel,
      default: () => null,
    },
    fileLimit: {
      type: Number,
      default: 0,
    },
    fileLength: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: '*',
    },
    uploadChange: {
      type: Function,
    },
  },
  setup(props) {
    const listModelData = isReactive(props.listModelData) ? props.listModelData : reactive(props.listModelData)
    return {
      uuid: uuid(),
      change: (e) => {
        const fileList = Array.from(e.target.files)
        const fileLength = props.fileLength ? props.fileLength - listModelData.data.filter((p) => !p.deleted).length : 0
        const errors = checkFile(fileList, {
          fileLength,
          fileLimit: props.fileLimit,
          fileType: props.fileType,
        })
        if (checkFileErrorMessage(errors)) {
          return
        }
        props.uploadChange(fileList)
      },
    }
  },
}
</script>
