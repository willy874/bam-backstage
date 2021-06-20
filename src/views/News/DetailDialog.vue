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
          <Ckeditor @ready="editorMounted" v-model="model.content" />
        </keep-alive>
      </div> -->
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { NewsMessageModel } from '@/models'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'updated', 'props', 'id', 'popupElement', 'dialog'],
  setup(props) {
    const model = reactive(new NewsMessageModel(props.props.model))
    return {
      model,
      editorMounted: () => {
        props.updated()
      },
      close: () => {
        props.dialog.closePopup(props.id)
      },
    }
  },
}
</script>
