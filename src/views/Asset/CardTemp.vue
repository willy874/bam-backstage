<template>
  <div class="shadow-lg flex-grow p-2 rounded-lg">
    <div class="flex flex-wrap" ref="root">
      <div class="p-2 transition" v-for="(image, index) in listData.data" :ref="setRefsItem(index)" :key="image.id" :style="{ width: columnWidth }">
        <div
          class="pt-1/1 relative border-2 rounded-lg focus:outline-none focus:border-primary-500 focus:border-opacity-50"
          tabindex="0"
          @click="clickItem(image)"
          @keydown="keydownItem(image)"
        >
          <div class="absolute inset-0 px-4 py-2 flex flex-col">
            <div class="flex-grow bg-cover bg-no-repeat bg-center mb-2 rounded" :style="{ backgroundImage: `url(${convUrl(image)})` }"></div>
            <div class="flex-shrink-0 h-12" @click.stop>
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
</template>

<script>
import { ref, onMounted, onUnmounted, isReactive, nextTick } from 'vue'
import { ListModel, ImageAssetModel } from '@/models/index'
import defaultImage from '@/components/image-viewbox/default-image.jpg'

export default {
  name: 'AssetCardTemp',
  inheritAttrs: false,
  props: {
    listModel: {
      type: ListModel,
    },
  },
  setup(props) {
    const listData = isReactive(props.listModel) ? props.listModel : reactive(props.listModel)
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
    return {
      ...refs,
      setRefsItem: (index) => {
        return (ref) => {
          if (ref) listData.data[index].ref = ref
        }
      },
      listData,
      columnWidth,
      clickItem(image) {
        console.log(image)
      },
      keydownItem(image) {
        console.log(image)
      },
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
