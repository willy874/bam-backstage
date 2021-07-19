<template>
  <DialogLayout v-bind="$props" title="分眾群組訊息推播">
    <form @submit="submit">
      <div class="py-2 -mx-2 sm:flex">
        <div class="flex-shrink-0 px-2 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">推播訊息</div>
        <div class="flex-grow">
          <TextBox type="textarea" rows="10" :model="model" field="text" placeholder="請輸入要對該群組推播的訊息" />
          <span class="text-red-500 text-xs" v-show="model.hasError('text')">{{ model.hasError('text') }}</span>
        </div>
      </div>
    </form>
    <template #footer>
      <div class="flex flex-wrap justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-2">
          <div class="p-1 text-red-500 flex items-center" v-show="errorMessages.length">
            <Icon src="Warning" size="24" />
            <div class="text-sm mx-1">資料填寫有誤或不完整</div>
          </div>
        </div>
        <div class="px-1 flex flex-wrap items-center">
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
          <SubmitButton class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">送出</SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { ref, reactive, nextTick } from 'vue'
import throttle from 'lodash/throttle'
import { MemberCategoryModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import { devErrorMessage } from '@/utility/error'
import Swal from '@/utility/alert'
import DialogLayout from '@/container/DialogLayout.vue'

export default {
  name: 'LinePointCreateDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new MemberCategoryModel(props.props.model))
    const errorMessages = ref([])
    const formTitleMarginTop = ref(6)
    const validateRules = {
      text: {
        presence: {
          allowEmpty: false,
          message: '^請填寫要推播的文字',
        },
      },
    }
    return {
      model,
      formTitleMarginTop,
      errorMessages,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
      submit: throttle(async (e) => {
        e.preventDefault()
        const modelErrorMessage = model.validate(validateRules)
        errorMessages.value = isModelError(modelErrorMessage)
        if (errorMessages.value.length) {
          await nextTick()
          props.initPosition()
          return
        }
        try {
          const res = await model.createData()
          if (res.isAxiosError) {
            throw res.message
          }
          await Swal.success({ title: '發送成功' })
          props.dialog.closePopup(props.id)
        } catch (error) {
          devErrorMessage({
            dir: '/src/views/Member/LinePoint',
            component: 'LinePointCreateDialog',
            func: 'submit',
            message: error.message,
          })
          Swal.error({ title: '發送失敗' })
        }
      }),
    }
  },
}
</script>
