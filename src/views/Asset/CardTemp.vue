<template>
  <div class="shadow-lg flex-grow flex flex-col rounded-lg border border-opacity-5 relative">
    <div class="absolute inset-0 flex-grow flex flex-col p-2">
      <div class="flex-grow overflow-auto scroll-bar">
        <div class="flex flex-wrap" ref="root">
          <div class="p-2 transition" v-for="(image, index) in filterList.data" :ref="setRefsItem(index)" :key="image.id" :style="{ width: columnWidth }">
            <div
              class="pt-1/1 relative border-2 rounded-lg focus:outline-none focus:border-primary-500 border-opacity-50"
              :class="{ 'shadow-focus': image.selected }"
              :tabindex="index + 1"
              @click="clickItem($event, image, index)"
              @keydown="keydownItem($event, image, index)"
            >
              <div class="absolute inset-0 px-4 py-2 flex flex-col">
                <div
                  class="flex-grow bg-cover bg-no-repeat bg-center mb-2 rounded"
                  @dblclick="dblclickImage($event, image, index)"
                  :style="{ backgroundImage: `url(${convUrl(image)})` }"
                ></div>
                <div class="flex-shrink-0 h-12" @click="clickStop">
                  <textarea
                    v-if="image.mode === 'edit'"
                    @blur="blurNameText(image)"
                    @change="changeNameText(image)"
                    class="w-full focus:outline-none focus:border-primary-500 border rounded resize-none"
                    rows="2"
                    v-model="image.name"
                  ></textarea>
                  <div v-else class="line-clamp-2 border border-transparent" @dblclick="dblclickNameText(image)">{{ image.name }}</div>
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
import { ListModel } from '@/models/index'
import defaultImage from '@/components/image-viewbox/default-image.jpg'
import { useDialog } from '@/components/dialog/index'
import LightBoxDialog from '@/container/LightBoxDialog.vue'
import throttle from 'lodash/throttle'

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
      return new ListModel({
        ...props.modelSchema,
        ...listData,
        data: listData.data.filter((p) => {
          const keywordRegExp = props.filterOptions.keyword ? new RegExp(props.filterOptions.keyword) : null
          if (keywordRegExp) return keywordRegExp.test(p.name)
          return true
        }),
      })
    })
    const refs = {
      root: ref(null),
    }
    const grid = ref(1)
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
    return {
      ...refs,
      setRefsItem: (index) => {
        return (ref) => {
          if (ref) filterList.value.data[index].ref = ref
        }
      },
      listData,
      filterList,
      columnWidth,
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
      }, 300),
      dblclickImage(e, image, index) {
        openLightBox(e, image, index)
      },
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
          case 'Enter':
            openLightBox(e, image, index)
        }
      }, 100),
      dblclickNameText: async (image) => {
        image.mode = 'edit'
        await nextTick()
        image.ref.querySelector('textarea').focus()
      },
      changeNameText: (image) => {
        // PUT
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
