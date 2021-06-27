<template>
  <div
    class="photo-frame"
    :class="{ 'photo-frame--hover': dragHover }"
    @click.stop="resetSelect"
    ref="root"
    @dragover="dragover"
    @drop="dropFileInput"
    @dragenter="dragenter"
    @dragleave="dragleave"
  >
    <div class="photo-frame__container" ref="container" v-if="filterList.length">
      <div
        class="photo-frame__container__item"
        v-for="(image, index) in filterList"
        :key="image.uuid"
        :style="{
          flexBasis: columnWidth,
          maxWidth: columnWidth,
        }"
        @dragover="dragover($event, image, index)"
        @dragenter="dragenterItem($event, image, index)"
        @dragleave="dragleaveItem($event, image, index)"
        @drop="dropFileInput($event, image, index)"
        :ref="setItem(index)"
      >
        <div
          class="photo-frame__container__item__block"
          @click.stop="clickImageItem($event, index)"
          :class="{ 'photo-frame__container__item__block--active': isActive(image) || image.dragHover }"
        >
          <ImageBox :src="image" display="background" class="photo-frame__container__item__block__image" />
          <div class="photo-frame__container__item__block__close" v-html="closeIcon" @click.stop="deleteImage($event, image)"></div>
        </div>
        <input class="photo-frame__container__item__input" type="file" @change="changeFileInput($event, image, index)" />
      </div>
    </div>
    <div class="photo-frame__container" v-else>
      <div
        class="photo-frame__container__item photo-frame__container__item--create"
        :style="{
          flexBasis: columnWidth,
          maxWidth: columnWidth,
        }"
      >
        <div class="photo-frame__container__item__block" @click="clickCreateImage('create')">
          <div class="photo-frame__container__item__block__image" :style="{ backgroundImage: `url(${uploadImage})` }"></div>
        </div>
        <input class="photo-frame__container__item__input" type="file" :multiple="fileLength > 1" ref="create" @change="changeFileInput" />
      </div>
    </div>
    <div class="photo-frame__fixed-bar" v-if="filterList.length">
      <div class="photo-frame__fixed-bar__plus" v-if="fileLength > filterList.length" @click.stop="clickCreateImage('plus')" v-html="plusIcon"></div>
      <input class="photo-frame__fixed-bar__plus__input" type="file" multiple="true" ref="plus" @change="changeFileInput" />
      <div class="photo-frame__fixed-bar__trash" v-if="selecteList.length" v-html="trashIcon" @click.stop="clearAll"></div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { v4 as uuid } from 'uuid'
import { ListModel, ImageModel } from '@/models/index'
import { FileName } from 'bam-utility-plugins'
import defaultImage from './default-image.jpg'
import addIcon from './add.svg'

export default {
  name: 'PhotoFrame',
  props: {
    model: {
      type: [Array, ListModel],
      validator: function (value) {
        const valid = () => {
          if (value instanceof ListModel) {
            return value.data.every((m) => m instanceof ImageModel)
          } else if (value instanceof Array) {
            return value.every((m) => m instanceof ImageModel)
          }
          return false
        }
        if (valid()) return true
        throw new Error('[Component PhotoFrame]: Is model must be a ImageModel collection.')
      },
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
    fileLimit: {
      type: [Number, String],
      validator: function (value) {
        if (Number(value) || Number(value) === 0) {
          return true
        }
      },
      default: 0,
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
    uploadImage: {
      type: String,
      default: addIcon,
    },
  },
  setup(props) {
    const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448" fill="currentColor">
<path d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"/>
</svg>`
    const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 365.696 365.696" fill="currentColor">
<path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
</svg>`
    const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
<path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/>
<path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/>
<path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/>
<path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/>
</svg>`
    const selecteList = reactive(props.selecteList)
    const list = (() => {
      if (props.model instanceof ListModel) {
        return reactive(props.model)
      } else {
        const result = reactive(new ListModel({ data: props.model, model: ImageModel }))
        result.data = props.model
        return result
      }
    })()
    const filterList = computed(() => list.data.filter((p) => !p.deleted))
    const refs = {
      create: ref(null),
      plus: ref(null),
      root: ref(null),
      container: ref(null),
    }
    const dragHover = ref(false)
    const resetSelect = () => {
      selecteList.splice(0)
    }
    const checkFileLength = (fileList) => {
      if (fileList.length + filterList.value.length > props.fileLength) {
        alert('上傳檔案數量超過上限')
        return true
      }
    }
    const checkFileLimit = (fileList) => {
      if (props.fileLimit) {
        if (fileList.every((f) => props.fileLimit < f.size)) {
          alert('上傳檔案大小不得超過' + props.fileLimit + ' bytes')
          return true
        }
      }
    }
    const checkFileType = (fileList) => {
      if (props.fileType) {
        if (typeof props.fileType === 'string' && fileList.some((f) => !new RegExp(props.fileType).test(f.type))) {
          alert('上傳檔案類型必須為 ' + props.fileType)
          return true
        }
        if (props.fileType instanceof RegExp && fileList.some((f) => !props.fileType.test(f.type))) {
          alert('上傳檔案類型必須為 ' + props.fileType.toString())
          return true
        }
        if (
          props.fileType instanceof Array &&
          !props.fileType.some((fileType) => {
            if (props.fileType instanceof RegExp) {
              return fileList.some((f) => !fileType.test(f.type))
            } else {
              return fileList.some((f) => !new RegExp(fileType).test(f.type))
            }
          })
        ) {
          alert('上傳檔案類型必須為 ' + props.fileType.join('、'))
          return true
        }
      }
    }
    const imageUpload = (fileList, imageIndex) => {
      // 沒有圖片就不動作
      if (fileList.length === 0) {
        return
      }
      // 判斷檔案數量
      if (checkFileLength(fileList)) {
        return
      }
      // 判斷檔案大小
      if (checkFileLimit(fileList)) {
        return
      }
      // 判斷檔案類型
      if (checkFileType(fileList)) {
        return
      }
      // 建立 ImageModel
      resetSelect(0)
      fileList
        .map((f, index) => {
          const filename = new FileName(f.name)
          const image = new ImageModel({
            id: 0,
            uuid: uuid(),
            name: f.name,
            image_name: filename.name,
            image_ext: filename.ext,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            size: f.size,
            type: f.type,
            sort: 99999,
            image_blob: fileList[index],
            edited: true,
          })
          return image
        })
        .forEach((image) => {
          if (fileList.length === 1 && (imageIndex || imageIndex === 0)) {
            filterList.value[imageIndex].set(image)
          } else {
            list.data.push(image)
          }
          const reader = new FileReader()
          reader.onload = (e) => {
            image.image_base64 = e.target.result
          }
          reader.readAsDataURL(image.image_blob)
        })
      filterList.value.forEach((image, index) => {
        image.sort = index
      })
      list.data.sort((a, b) => a.sort - b.sort)
    }
    const columnWidth = ref('50%')
    const checkWidth = () => {
      const width = refs.root.value.offsetWidth
      switch (true) {
        case width > 1024:
          columnWidth.value = '20%'
          break
        case width > 768:
          columnWidth.value = '25%'
          break
        case width > 576:
          columnWidth.value = '33.3333%'
          break
        default:
          columnWidth.value = '50%'
          break
      }
    }
    onMounted(() => {
      checkWidth()
      window.addEventListener('resize', checkWidth)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', checkWidth)
    })
    return {
      listData: list,
      filterList,
      setItem: (index) => {
        return (el) => {
          if (el) filterList.value[index].el = el
        }
      },
      ...refs,
      plusIcon,
      closeIcon,
      trashIcon,
      columnWidth,
      dragHover,
      clickCreateImage: (refsName) => {
        refs[refsName].value.click()
      },
      clickImageItem: (e, index) => {
        if (e.ctrlKey) {
          const model = filterList.value[index]
          if (selecteList.includes(model)) {
            const index = selecteList.indexOf(model)
            selecteList.splice(index, 1)
          } else {
            selecteList.push(model)
          }
        } else {
          filterList.value[index].el.querySelector('input').click()
        }
      },
      resetSelect,
      isActive: (item) => {
        return selecteList.includes(item)
      },
      changeFileInput: (e, image, index) => {
        const fileList = Array.from(e.target.files)
        imageUpload(fileList, index)
      },
      deleteImage: (e, image) => {
        image.deleted_at = new Date().toISOString()
        image.deleted = true
      },
      changeModel: (e, image) => {
        image.updated_at = new Date().toISOString()
        image.edited = true
      },
      clearAll: () => {
        filterList.value.forEach((image) => {
          if (selecteList.includes(image)) {
            const index = filterList.value.indexOf(image)
            filterList.value[index].deleted = true
          }
        })
        resetSelect(0)
      },
      dragover: (e) => {
        e.preventDefault()
        e.stopPropagation()
      },
      dropFileInput: (e, image, index) => {
        e.preventDefault()
        e.stopPropagation()
        dragHover.value = false
        filterList.value.forEach((image) => {
          image.dragHover = false
        })
        const fileList = Array.from(e.dataTransfer.files)
        imageUpload(fileList, index)
      },
      dragleave: (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!refs.root.value.contains(e.fromElement)) {
          dragHover.value = false
        }
      },
      dragenter: (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (refs.root.value === e.target || refs.container.value === e.target) {
          dragHover.value = true
          filterList.value.forEach((image) => {
            image.dragHover = false
          })
        }
      },
      dragleaveItem: (e, image, index) => {
        e.preventDefault()
        e.stopPropagation()
      },
      dragenterItem: (e, image, index) => {
        e.preventDefault()
        e.stopPropagation()
        filterList.value.forEach((image) => {
          image.dragHover = false
        })
        dragHover.value = false
        image.dragHover = true
      },
    }
  },
}
</script>

<style lang="scss" scoped src="./photo-frame.scss"></style>
