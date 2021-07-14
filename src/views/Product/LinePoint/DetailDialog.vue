<template>
  <DialogLayout v-bind="$props" title="Line Point 資料">
    <form @submit="submit">
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px`, marginTop: `${formTitleMarginTop}px` }">Point 序號</div>
        <div class="flex flex-grow">
          <div class="flex-grow">
            <TextBox type="text" :model="model" field="number" placeholder="請輸入序號" :disabled="isDisabled" />
            <span class="text-red-500 text-xs" v-show="model.hasError('number')">{{ model.hasError('number') }}</span>
          </div>
          <div class="flex flex-shrink-0 px-2 items-start">
            <div v-if="model.state === 0" class="flex relative border border-blue-500 text-blue-500 rounded hover:text-white hover:bg-blue-500 py-1">
              <input id="male" class="hidden" v-model="model.state" type="radio" name="gender" :value="1" />
              <label for="male" class="inline-block px-2 stretched-link">下架</label>
            </div>
            <div v-if="model.state === 1" class="flex relative border border-green-500 text-green-500 rounded hover:text-white hover:bg-green-500 py-1">
              <input id="female" class="hidden" v-model="model.state" type="radio" name="gender" :value="0" />
              <label for="female" class="inline-block px-2 stretched-link">上架</label>
            </div>
            <div v-if="model.state === 3" class="flex relative border border-red-500 text-red-500 rounded py-1">
              <div class="px-2">已使用</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2">
        <div class="p-2 flex xs:w-1/2">
          <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px` }">最後修改時間</div>
          <div class="flex-grow">
            <span>{{ dayFormat(model.updated_at) }}</span>
          </div>
        </div>
        <div class="p-2 flex xs:w-1/2">
          <div class="flex-shrink-0" :style="{ width: `${formTitleWidth}px` }">建立時間</div>
          <div class="flex-grow">
            <span>{{ dayFormat(model.created_at) }}</span>
          </div>
        </div>
      </div>
    </form>
    <template #footer>
      <div class="flex justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-2">
          <div class="px-1 text-red-500 flex items-center" v-show="errorMessages.length">
            <Icon src="Warning" size="24" />
            <div class="text-sm mx-1">資料填寫有誤或不完整</div>
          </div>
        </div>
        <div class="px-1 flex items-center">
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
          <SubmitButton v-if="!isDisabled" class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">
            送出
          </SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, nextTick, computed } from 'vue'
import throttle from 'lodash/throttle'
import dayjs from 'dayjs'
import { LinePointModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import DialogLayout from '@/container/DialogLayout.vue'
import Swal from '@/utility/alert'

export default {
  name: 'LinePointDetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new LinePointModel(props.props.model))
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(7)
    const formTitleWidth = ref(120)
    const validateRules = {
      number: {
        presence: {
          allowEmpty: false,
          message: '^請填寫序號',
        },
      },
    }
    const close = throttle(() => {
      props.dialog.closePopup(props.id)
    }, 300)
    return {
      model,
      formTitleWidth,
      formTitleMarginTop,
      errorMessages,
      close,
      isDisabled: computed(() => model.state > 1),
      dayFormat: (dateTime, type) => {
        if (type === 'date') {
          return dayjs(dateTime).format('YYYY/MM/DD')
        }
        if (type === 'time') {
          return dayjs(dateTime).format('HH:mm:ss')
        }
        return dayjs(dateTime).format('YYYY/MM/DD HH:mm:ss')
      },
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
          if (model.id === 0 || model.id === '') {
            const res = await model.createData()
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model = model
          } else {
            const res = await model.updateData({
              requesHandler(model) {
                return {
                  product_id: model.product_id,
                  number: model.number,
                  state: model.state,
                }
              },
            })
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model.set(model)
          }
          props.dialog.closePopup(props.id)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('%c[Product LinePointDetailDialog] Error: submit', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
          Swal.error({
            icon: 'error',
            title: '儲存失敗',
          })
        }
      }, 1000),
      convState(code) {
        switch (code) {
          case 0:
            return {
              color: 'rgb(59, 130, 246)',
              text: '下架',
            }
          case 1:
            return {
              color: 'rgb(52, 211, 153)',
              text: '上架',
            }
          case 2:
            return {
              color: 'rgb(156, 163, 175)',
              text: '已使用',
            }
          default:
            return {
              text: '',
            }
        }
      },
    }
  },
}
</script>
