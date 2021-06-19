<template>
  <div class="row">
    <div class="col-auto">
      <ImageBox class="img-contain bg-cover" :src="model" :style="{ width, height, backgroundImage: `url(${imageBackground})` }" />
    </div>
    <div class="col">
      <div class="py-2">
        <button type="button" class="btn btn-danger" v-if="model.image_blob || model.image_base64" @click="clearImage">刪除圖片</button>
        <button type="button" class="btn btn-primary text-white" v-else @click="clickCreateImage">上傳圖片</button>
        <input class="" type="file" ref="upload" @change="changeFileInput" />
      </div>
      <div class="small">
        <div v-if="fileDimension">建議尺寸: {{ fileDimension }}</div>
        <div>檔案限定: {{ fileTypeFormat(fileType) }}</div>
        <div v-if="fileLimit">檔案大小: {{ fileLimitFormat(fileLimit) }} {{ fileLimitUnit }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import { ImageModel } from '@/models'
import { FileName } from '@/utility'
import defaultImage from './default-image.jpg'
import imageBackground from './image-background.png'

export default {
  name: 'ImageUpload',
  model: {
    prop: 'model',
    event: 'update',
  },
  props: {
    model: {
      type: ImageModel,
      default: () => new ImageModel(),
    },
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    fileDimension: {
      type: String,
      default: '',
    },
    fileLimit: {
      type: [Number, String],
      validator: function (value) {
        if (Number(value) || Number(value) === 0) {
          return true
        }
      },
      default: 0,
    },
    fileLimitUnit: {
      type: String,
      default: 'bytes',
    },
    fileType: {
      type: [Array, RegExp, String],
      default: () => {
        return 'image'
      },
    },
    defaultImage: {
      type: String,
      default: defaultImage,
    },
  },
  data() {
    return {
      imageBackground,
    }
  },
  methods: {
    commaFormat(value) {
      return Math.floor(value)
        .toString()
        .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, (all, pre, groupOf3Digital) => {
          return pre + groupOf3Digital.replace(/\d{3}/g, ',$&')
        })
    },
    fileLimitFormat(value) {
      if (this.fileLimitUnit.toUpperCase() === 'KB') {
        return this.commaFormat(0.1 ** 3 * value)
      } else if (this.fileLimitUnit.toUpperCase() === 'MB') {
        return this.commaFormat(0.1 ** 6 * value)
      } else if (this.fileLimitUnit.toUpperCase() === 'GB') {
        return this.commaFormat(0.1 ** 9 * value)
      } else {
        return this.commaFormat(value)
      }
    },
    fileTypeFormat(value) {
      if (Array.isArray(value)) {
        value.join('、')
      } else if (typeof value === 'string') {
        return value
      } else {
        value.toString()
      }
    },
    clickCreateImage() {
      this.$refs.upload.click()
    },
    changeFileInput(e) {
      const fileList = [...e.target.files]
      this.imageUpload(fileList)
    },
    checkFileLimit(fileList) {
      if (this.fileLimit) {
        if (fileList.every((f) => this.fileLimit < f.size)) {
          alert('上傳檔案大小不得超過' + this.fileLimit + ' bytes')
          return true
        }
      }
    },
    checkFileType(fileList) {
      if (this.fileType) {
        if (typeof this.fileType === 'string' && fileList.some((f) => !new RegExp(this.fileType).test(f.type))) {
          alert('上傳檔案類型必須為 ' + this.fileType)
          return true
        }
        if (this.fileType instanceof RegExp && fileList.some((f) => !this.fileType.test(f.type))) {
          alert('上傳檔案類型必須為 ' + this.fileType.toString())
          return true
        }
        if (
          this.fileType instanceof Array &&
          this.fileType.some((fileType) => {
            if (this.fileType instanceof RegExp) {
              return fileList.some((f) => !fileType.test(f.type))
            } else {
              return fileList.some((f) => !new RegExp(fileType).test(f.type))
            }
          })
        ) {
          alert('上傳檔案類型必須為 ' + this.fileType.join('、'))
          return true
        }
      }
    },
    imageUpload(fileList) {
      // 沒有圖片就不動作
      if (fileList.length === 0) {
        return
      }
      // 判斷檔案大小
      if (this.checkFileLimit(fileList)) {
        return
      }
      // 判斷檔案類型
      if (this.checkFileType(fileList)) {
        return
      }
      // 建立 ImageModel
      fileList
        .map((f, index) => {
          const filename = new FileName(f.name)
          const image = new ImageModel({
            id: 0,
            uuid: uuid(),
            name: f.name,
            image_name: filename.name,
            image_ext: filename.ext,
            created_at: dayjs().format('YYYY/MM/DD HH:mm:ss'),
            updated_at: dayjs().format('YYYY/MM/DD HH:mm:ss'),
            size: f.size,
            type: f.type,
            sort: 0,
            image_blob: fileList[index],
            edited: true,
          })
          return image
        })
        .forEach((image) => {
          this.model.set(image)
          const reader = new FileReader()
          reader.onload = (e) => {
            this.model.image_base64 = e.target.result
          }
          reader.readAsDataURL(this.model.image_blob)
        })
    },
    clearImage() {
      this.model.set(new ImageModel())
    },
  },
}
</script>

<style lang="scss" scoped>
input[type='file'] {
  display: none;
}
</style>
