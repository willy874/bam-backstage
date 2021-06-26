<template>
  <div class="bg-white p-4 rounded-lg shadow-2xl border">
    <div class="flex justify-between">
      <div>
        <button class="" type="button" draggable="true" @dragstart="drag" @touchstart="touch" style="cursor: grab">我要拖曳</button>
      </div>
      <div>
        <button class="" type="button" @click="close">
          <Icon class="transform rotate-45" src="Add" size="24" />
        </button>
      </div>
    </div>
    <div class="py-4">
      <div>
        <TextBox type="textarea" :model="model" field="content" rows="5" />
      </div>
      <!-- <div>
        <keep-alive>
          <Ckeditor @ready="ready" v-model="model.content" />
        </keep-alive>
      </div> -->
    </div>
    <div>
      <ImageBox src="http://api.tocin.bsdctw.tw/api/images/carousels/7970010B-5D10-474B-A56C-59137AA20479.jpeg" @ready="ready" />
    </div>
    <div class="py-4">
      <PhotoFrame :model="[]" />
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { NewsMessageModel } from '@/models'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  setup(props) {
    const model = reactive(new NewsMessageModel(props.props.model))
    return {
      model,
      ready() {
        props.initPosition()
      },
      close: () => {
        props.dialog.closePopup(props.id)
      },
    }
  },
}
</script>
