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
      <div class="px-1 leading-none">
        <button class="mx-1 text-primary-mirror btn-icon" type="button" @click="close">
          <Icon class="transform rotate-45" src="Add" size="16" />
        </button>
      </div>
    </header>
    <main ref="main" class="p-1">
      <div class="scroll-bar px-4 py-3" style="height: calc(100vh - 140px)">
        <form @submit="submit">
          <div class="py-2 sm:flex">
            <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px`, margin: `${formTitleMarginTop}px` }">標題</div>
            <div class="flex-grow">
              <TextBox type="text" :model="model" field="subject" placeholder="請輸入標題" />
              <span class="text-red-500 text-xs" v-show="model.hasError('subject')">{{ model.hasError('subject') }}</span>
            </div>
          </div>
          <div class="py-2 sm:flex">
            <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px`, margin: `${formTitleMarginTop}px` }">內容</div>
            <div class="flex-grow sm:w-0">
              <TextBox type="textarea" :model="model" field="content" rows="5" placeholder="請輸入內文" />
              <!-- <keep-alive>
                <Ckeditor @ready="ready" v-model="model.content" />
              </keep-alive> -->
              <span class="text-red-500 text-xs" v-show="model.hasError('content')">{{ model.hasError('content') }}</span>
            </div>
          </div>
          <div class="py-2 sm:flex">
            <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px`, margin: `${formTitleMarginTop}px` }">圖片</div>
            <div class="flex-grow">
              <PhotoFrame :model="model.images" :class="{ 'is-invalid': model.hasError('images') }" />
              <span class="text-red-500 text-xs" v-show="model.hasError('images')">{{ model.hasError('images') }}</span>
            </div>
          </div>
        </form>
      </div>
    </main>
    <footer class="flex justify-between items-center rounded-b-lg border-t p-2" ref="footer">
      <div class="px-2">
        <div class="px-1 text-red-500 flex items-center" v-show="errorMessages.length">
          <Icon src="Warning" size="24" />
          <div class="text-sm mx-1">資料填寫有誤或不完整</div>
        </div>
      </div>
      <div class="px-1 flex items-center">
        <button v-if="model.id" class="btn mx-1 text-primary-mirror bg-red-500 hover:bg-red-600" type="button" @click="deleteModel">刪除</button>
        <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
        <Button class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">送出</Button>
      </div>
    </footer>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { NewsMessageModel } from '@/models'
import { isModelError } from '@/utility/model-handle'
import swAlert from '@/utility/alert'
import throttle from 'lodash/throttle'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  setup(props) {
    const model = reactive(new NewsMessageModel(props.props.model))
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleWidth = ref(80)
    const formTitleMarginTop = ref(7)
    const refs = {
      header: ref(null),
      main: ref(null),
      footer: ref(null),
    }
    const validateRules = {
      subject: {
        presence: {
          allowEmpty: false,
          message: '^請填寫標題文字',
        },
      },
      content: {
        presence: {
          allowEmpty: false,
          message: '^請填寫內容文字',
        },
      },
      images: () => {
        if (model.images.length && model.images.every((p) => p.image_blob || p.deleted)) {
          return {}
        }
        return {
          inclusion: {
            message: '^請上傳圖片',
          },
        }
      },
    }
    return {
      ...refs,
      model,
      formTitleWidth,
      formTitleMarginTop,
      errorMessages,
      ready() {
        props.initPosition()
      },
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
      deleteModel: async () => {
        const swalResult = await swAlert.delete()
        try {
          if (swalResult.isConfirmed) {
            // await popupProps.model.deleteData()
            popupProps.model.deleted = true
            props.dialog.closePopup(props.id)
          }
        } catch (error) {
          console.log(error)
        }
      },
      submit: throttle(async (e) => {
        e.preventDefault()
        const modelErrorMessage = model.validate(validateRules)
        errorMessages.value = isModelError(modelErrorMessage)
        if (errorMessages.value.length) {
          return
        }
        try {
          // 依據 id 是否為有數字欄決定新增或修改
          if (model.id === 0) {
            await model.createData()
            popupProps.model = model
          } else {
            await model.updateData()
            popupProps.model.set(model)
          }
        } catch (error) {
          console.log(error)
        }
      }, 1000),
    }
  },
}
</script>
