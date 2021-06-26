<template>
  <div class="bg-white rounded-lg shadow-2xl">
    <header
      ref="header"
      class="flex justify-between items-center rounded-t-lg border-b bg-primary-500 p-2"
      draggable="true"
      @dragstart="drag"
      @touchstart="touch"
    >
      <div class="px-2">
        <h2 class="text-primary-mirror">最新消息</h2>
      </div>
      <div class="px-2 leading-none">
        <button class="text-primary-mirror" type="button" @click="close">
          <Icon class="transform rotate-45" src="Add" size="16" />
        </button>
      </div>
    </header>
    <main ref="main" class="p-1">
      <div class="scroll-bar px-4 py-3" style="height: calc(100vh - 140px)">
        <form @submit="submit">
          <div class="py-2 flex">
            <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px`, margin: `${formTitleMarginTop}px` }">標題</div>
            <div class="flex-grow">
              <TextBox type="text" :model="model" field="subject" />
            </div>
          </div>
          <div class="py-2 flex">
            <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px`, margin: `${formTitleMarginTop}px` }">內容</div>
            <!-- <TextBox type="textarea" :model="model" field="content" rows="5" /> -->
            <div class="flex-grow w-0">
              <keep-alive>
                <Ckeditor @ready="ready" v-model="model.content" />
              </keep-alive>
            </div>
          </div>
          <div class="py-2 flex">
            <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px`, margin: `${formTitleMarginTop}px` }">圖片</div>
            <PhotoFrame class="flex-grow" :model="[]" />
          </div>
          <!-- <div>
            <ImageBox src="http://api.tocin.bsdctw.tw/api/images/carousels/7970010B-5D10-474B-A56C-59137AA20479.jpeg" @ready="ready" />
          </div> -->
        </form>
      </div>
    </main>
    <footer class="flex justify-between items-center rounded-b-lg border-t p-2" ref="footer">
      <div class="px-2"></div>
      <div class="px-2">
        <button class="btn text-primary-mirror bg-green-500 hover:bg-green-600" type="button" @click="submit">送出</button>
      </div>
    </footer>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { NewsMessageModel } from '@/models'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  setup(props) {
    const model = reactive(new NewsMessageModel(props.props.model))
    const formTitleWidth = ref(80)
    const formTitleMarginTop = ref(7)
    const refs = {
      header: ref(null),
      main: ref(null),
      footer: ref(null),
    }
    return {
      ...refs,
      model,
      formTitleWidth,
      formTitleMarginTop,
      ready() {
        props.initPosition()
      },
      close: () => {
        props.dialog.closePopup(props.id)
      },
      submit: () => {},
    }
  },
}
</script>
