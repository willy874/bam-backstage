<template>
  <div class="shadow-lg flex-grow flex flex-col rounded-lg border border-opacity-5 relative">
    <div class="absolute inset-0 flex-grow flex flex-col p-2">
      <div class="flex-grow overflow-auto scroll-bar">
        <div
          class="flex flex-wrap"
          :class="{ 'bg-primary-500 bg-opacity-10': dragHover }"
          ref="root"
          @drop="drop"
          @dragover="dragover"
          @dragenter="dragenter"
          @dragleave="dragleave"
        >
          <div class="p-2 transition" v-for="(image, index) in filterList.data" :ref="setRefsItem(index)" :key="image.id" :style="{ width: columnWidth }">
            <div
              class="pt-1/1 relative border-2 rounded-lg focus:outline-none focus:border-primary-500 border-opacity-50"
              :class="{ 'shadow-focus': image.selected }"
              :tabindex="index + 1"
              @focus="focusItem($event, image)"
              @blur="blurItem"
              @click.stop="clickItem($event, image, index)"
              @keydown="keydownItem($event, image, index)"
            >
              <div class="absolute inset-0 px-4 py-2 flex flex-col">
                <div
                  class="flex-grow bg-cover bg-no-repeat bg-center mb-2 rounded"
                  @dblclick="openLightBox($event, image, index)"
                  :style="{ backgroundImage: `url(${convUrl(image)})` }"
                ></div>
                <div class="flex-shrink-0 h-12" @click="clickStop">
                  <textarea
                    v-if="image.mode === 'edit'"
                    v-model="image.name"
                    class="w-full focus:outline-none focus:border-primary-500 border rounded resize-none"
                    rows="2"
                    @keydown.stop
                    @blur="blurNameText(image)"
                    @change="changeNameText(image)"
                  ></textarea>
                  <div v-else class="line-clamp-2 border border-transparent" @dblclick="editModel($event, image)">{{ image.name }}</div>
                </div>
              </div>
              <div class="absolute top-1 right-2" v-show="focusImage === image">
                <div class="p-1" v-if="!isSystemImage(image)">
                  <div
                    class="
                      btn-icon
                      bg-gray-200 bg-opacity-60
                      text-red-500 text-opacity-60
                      hover:bg-opacity-100 hover:text-opacity-100
                      p-2
                      w-9
                      h-9
                      rounded-full
                      cursor-pointer
                    "
                    @click="deleteImage($event, image, index)"
                  >
                    <Icon src="Add" class="transform rotate-45" size="20" />
                  </div>
                </div>
                <div class="p-1">
                  <div
                    class="
                      btn-icon
                      bg-gray-200 bg-opacity-60
                      text-blue-500 text-opacity-60
                      hover:bg-opacity-100 hover:text-opacity-100
                      p-2
                      w-9
                      h-9
                      rounded-full
                      cursor-pointer
                    "
                    @click="openLightBox($event, image, index)"
                  >
                    <Icon src="Eye" size="20" />
                  </div>
                </div>
                <div class="p-1">
                  <div
                    class="
                      btn-icon
                      bg-gray-200 bg-opacity-60
                      text-primary-500 text-opacity-60
                      hover:text-opacity-100 hover:bg-opacity-100
                      p-2
                      w-9
                      h-9
                      rounded-full
                      cursor-pointer
                    "
                    @click="editModel($event, image, index)"
                  >
                    <Icon src="Edit" size="20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, reactive, nextTick, computed } from 'vue'
import throttle from 'lodash/throttle'
import { ListModel } from '@/models/index'
import defaultImage from '@/components/image-viewbox/default-image.jpg'
import { useDialog } from '@/components/dialog/index'
import LightBoxDialog from '@/container/LightBoxDialog.vue'
import Swal from '@/utility/alert'

export default {
  name: 'AssetCardTemp',
  inheritAttrs: false,
  props: {
    listModelData: {
      type: ListModel,
    },
    uploadChange: {
      type: Function,
    },
    modelSchema: {
      type: Object,
    },
    filterOptions: {
      type: Object,
    },
  },
  setup(props) {
    const dialog = useDialog()
    const listData = reactive(props.listModelData)
    const filterList = computed(() => {
      const list = new ListModel({
        ...props.modelSchema,
        ...listData,
      })
      return list.set({
        data: listData.data.filter((model) => {
          try {
            const keywordRegExp = props.filterOptions.keyword ? new RegExp(props.filterOptions.keyword) : false
            if (keywordRegExp) {
              return keywordRegExp.test(model.name)
            } else {
              return true
            }
          } catch (error) {
            return true
          }
        }),
      })
    })
    const refs = {
      root: ref(null),
    }
    const dragHover = ref(false)
    const focusImage = ref(null)
    const textValue = ref('')
    const grid = ref(8)
    const columnWidth = ref('100%')
    const checkWidth = () => {
      const width = refs.root.value.offsetWidth
      switch (true) {
        case width > 1536:
          grid.value = 8
          break
        case width > 1024:
          grid.value = 5
          break
        case width > 768:
          grid.value = 4
          break
        case width > 576:
          grid.value = 3
          break
        default:
          grid.value = 2
          break
      }
      columnWidth.value = `${100 / grid.value}%`
    }
    onMounted(() => {
      checkWidth()
      window.addEventListener('resize', checkWidth)
      window.addEventListener('toggleAsideEnd', checkWidth)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', checkWidth)
      window.removeEventListener('toggleAsideEnd', checkWidth)
    })
    const openLightBox = async (e, image, index) => {
      const popup = await dialog.popup(LightBoxDialog, {
        width: '100%',
        props: {
          model: filterList.value,
          index: index,
        },
      })
      filterList.value.data[popup.props.index].ref.querySelector('[tabindex]').focus()
      return popup
    }
    const isSystemImage = (image) => image.tags.find((p) => p.name === 'System')
    const deleteImage = throttle(async (e, image, index) => {
      if (isSystemImage(image)) {
        return Swal.error({ title: '系統圖片無法被刪除' })
      }
      const swalResult = await Swal.delete()
      if (swalResult.isConfirmed) {
        try {
          const res = await image.deleteData()
          if (res.isAxiosError) {
            throw res.message
          }
          listData.data.splice(index, 1)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('%c[AssetCardTemp] Error: deleteImage', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
        }
      }
    }, 400)
    return {
      ...refs,
      openLightBox,
      dragHover,
      focusImage,
      setRefsItem: (index) => {
        return (ref) => {
          if (ref) filterList.value.data[index].ref = ref
        }
      },
      listData,
      filterList,
      columnWidth,
      isSystemImage,
      clickItem: throttle((e, image, index) => {
        if (e.ctrlKey) {
          image.selected = !image.selected
        } else {
          if (!image.selected) {
            filterList.value.data.forEach((model) => {
              model.selected = false
            })
          }
        }
      }, 200),
      deleteImage,
      clickStop(e) {
        if (!e.ctrlKey) {
          e.stopPropagation()
        }
      },
      keydownItem: throttle((e, image, index) => {
        e.preventDefault()
        const keyName = e.key
        switch (keyName) {
          case 'ArrowUp':
            const upTarget = filterList.value.data[index - grid.value]
            if (upTarget) upTarget.ref.querySelector('[tabindex]').focus()
            break
          case 'ArrowDown':
            const downTarget = filterList.value.data[index + grid.value]
            if (downTarget) downTarget.ref.querySelector('[tabindex]').focus()
            break
          case 'ArrowLeft':
            if (index) filterList.value.data[index - 1].ref.querySelector('[tabindex]').focus()
            break
          case 'ArrowRight':
            if (filterList.value.data.length - 1 !== index) filterList.value.data[index + 1].ref.querySelector('[tabindex]').focus()
            break
          case 'Delete':
            deleteImage(e, image, index)
            break
          case 'Enter':
            openLightBox(e, image, index)
        }
      }, 200),
      focusItem(e, image) {
        focusImage.value = image
      },
      blurItem() {
        focusImage.value = null
      },
      drop(e) {
        e.preventDefault()
        e.stopPropagation()
        if (props.uploadChange) {
          const filterList = Array.from(e.dataTransfer.files)
          if (filterList.length) {
            props.uploadChange(filterList)
          }
        }
      },
      dragover(e) {
        e.preventDefault()
        e.stopPropagation()
      },
      dragenter(e) {
        e.preventDefault()
        e.stopPropagation()
        if (props.uploadChange) {
          dragHover.value = true
        }
      },
      dragleave(e) {
        e.preventDefault()
        e.stopPropagation()
        if (props.uploadChange) {
          if (!refs.root.value.contains(e.fromElement)) {
            dragHover.value = false
          }
        }
      },
      changeNameText: async (image) => {
        try {
          const res = await image.updateData({
            requesHandler(model) {
              return {
                name: model.name,
              }
            },
          })
          if (res.isAxiosError) {
            throw res.message
          }
        } catch (error) {
          image.name = textValue.value
          if (process.env.NODE_ENV === 'development') {
            console.log('%c[AssetCardTemp] Error: changeNameText', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
        }
      },
      editModel: async (e, image) => {
        image.mode = 'edit'
        await nextTick()
        image.ref.querySelector('textarea').focus()
        textValue.value = image.name
      },
      blurNameText: (image) => {
        image.mode = 'static'
      },
      convUrl(image) {
        if (image.image_base64) {
          return image.image_base64
        }
        return defaultImage
      },
    }
  },
}
</script>
