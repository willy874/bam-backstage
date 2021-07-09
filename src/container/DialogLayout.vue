<template>
  <div data-name="DialogLayout" class="bg-white rounded-lg shadow-2xl my-3">
    <header
      ref="header"
      class="flex justify-between items-center border-b bg-primary-500 p-2"
      :class="[windowShow ? 'rounded-t-lg' : 'rounded-lg']"
      draggable="true"
      @dragstart="drag"
      @touchstart="touch"
    >
      <div class="px-2">
        <h2 class="text-primary-mirror">{{ title }}</h2>
      </div>
      <div class="px-1 leading-none">
        <button class="mx-1 text-primary-mirror btn-icon" type="button" @click="windowShow = !windowShow">
          <Icon src="Eye" size="16" />
        </button>
        <button class="mx-1 text-primary-mirror btn-icon" type="button" @click="close">
          <Icon class="transform rotate-45" src="Add" size="16" />
        </button>
      </div>
    </header>
    <nav v-if="$slots.navbar" v-show="windowShow">
      <slot name="navbar"></slot>
    </nav>
    <main ref="main" class="p-1" v-show="windowShow">
      <div class="scroll-bar px-4 py-3" :style="{ maxHeight: 'calc(100vh - 140px)', ...mainStyle }">
        <slot name="default"></slot>
      </div>
    </main>
    <footer v-if="$slots.footer" v-show="windowShow">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import throttle from 'lodash/throttle'

export default {
  name: 'DialogLayout',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition', 'title', 'mainStyle'],
  setup(props) {
    const windowShow = ref(true)
    return {
      windowShow,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
    }
  },
}
</script>
