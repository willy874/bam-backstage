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
import { checkFile } from '@/utility/file'
import Swal from '@/utility/alert'

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
        if (errors) {
          switch (errors) {
            case 'fileLength':
              Swal.error({ title: '檔案上傳數已達上限' })
              break
            case 'fileLimit':
              Swal.error({ title: '檔案上傳包含過大的檔案' })
              break
            case 'fileType':
              Swal.error({ title: '檔案上傳包含不正確類型' })
              break
            default:
              Swal.error({ title: '檔案上傳失敗' })
              break
          }
          return
        }
        props.uploadChange(fileList)
      },
    }
  },
}
</script>
