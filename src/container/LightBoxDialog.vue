<template>
  <div ref="root" tabindex="0" data-name="DialogLayout" class="flex items-center justify-center h-screen w-screen relative" @click="close" @keydown="keydown">
    <header></header>
    <main>
      <img :src="model.image_base64" class="object-contain" :style="{ height: 'calc(100vh - 3rem)', width: 'calc(100vw - 3rem)' }" />
    </main>
    <aside class="absolute inset-x-0 top-1/2">
      <div class="absolute left-3 transform rotate-90">
        <button
          v-if="index"
          type="button"
          class="cursor-pointer rounded-full p-2 focus:outline-none bg-white hover:bg-gray-200 bg-opacity-80"
          @click.stop="prevPhoto"
        >
          <Icon class="text-primary-500 relative" src="ArrowSolid" size="24" style="top: 2px" />
        </button>
      </div>
      <div class="absolute right-3 transform -rotate-90">
        <button
          v-if="listData.data.length - 1 !== index"
          type="button"
          class="cursor-pointer rounded-full p-2 focus:outline-none bg-white hover:bg-gray-200 bg-opacity-80"
          @click.stop="nextPhoto"
        >
          <Icon class="text-primary-500 relative" src="ArrowSolid" size="24" style="top: 2px" />
        </button>
      </div>
    </aside>
    <footer></footer>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive } from 'vue'
import throttle from 'lodash/throttle'

export default {
  name: 'DialogLayout',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  setup(props) {
    const root = ref(null)
    const index = ref(props.props.index)
    const listData = reactive(props.props.model)
    const model = computed(() => {
      return listData.data[index.value]
    })
    onMounted(() => {
      root.value.focus()
    })
    const close = throttle(() => {
      props.props.index = index.value
      props.dialog.closePopup(props.id)
    }, 500)
    const prevPhoto = () => {
      if (index.value) index.value = index.value - 1
    }
    const nextPhoto = () => {
      if (listData.data.length - 1 !== index.value) index.value = index.value + 1
    }
    const keydown = throttle((e) => {
      e.preventDefault()
      const keyName = e.key
      switch (keyName) {
        case 'ArrowUp':
          prevPhoto()
          break
        case 'ArrowDown':
          nextPhoto()
          break
        case 'ArrowLeft':
          prevPhoto()
          break
        case 'ArrowRight':
          nextPhoto()
          break
        case 'Backspace':
          prevPhoto()
          break
        case 'Enter':
          nextPhoto()
          break
        case 'Escape':
          close()
          break
        case 'Delete':
          close()
          break
      }
    }, 100)
    return {
      root,
      model,
      index,
      listData,
      prevPhoto,
      nextPhoto,
      close,
      keydown,
    }
  },
}
</script>
