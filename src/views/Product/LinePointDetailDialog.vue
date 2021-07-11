<template>
  <DialogLayout v-bind="$props" title="Line Point 資料">
    <form @submit="submit">
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">電子郵件</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="email" placeholder="請輸入電子郵件" />
          <span class="text-red-500 text-xs" v-show="model.hasError('email')">{{ model.hasError('email') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">電話號碼</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="phone_number" placeholder="請輸入電話號碼" />
          <span class="text-red-500 text-xs" v-show="model.hasError('phone_number')">{{ model.hasError('phone_number') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">地址</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="address" placeholder="請輸入地址" />
          <span class="text-red-500 text-xs" v-show="model.hasError('address')">{{ model.hasError('address') }}</span>
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
          <SubmitButton class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">送出</SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, onMounted, nextTick } from 'vue'
import throttle from 'lodash/throttle'
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
    onMounted(async () => {
      await model.readData()
    })
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(7)
    const validateRules = {
      real_name: {
        presence: {
          allowEmpty: false,
          message: '^請填寫姓名',
        },
      },
      gender: {
        presence: {
          allowEmpty: false,
          message: '^請選擇性別',
        },
      },
      email: {
        presence: {
          allowEmpty: false,
          message: '^請填寫電子郵件',
        },
        email: {
          message: '^填寫的電子信箱格式不正確',
        },
      },
      phone_number: {
        presence: {
          allowEmpty: false,
          message: '^請填寫電話號碼',
        },
      },
      address: {
        presence: {
          allowEmpty: false,
          message: '^請填寫地址',
        },
      },
    }
    return {
      model,
      formTitleMarginTop,
      errorMessages,
      ready() {
        props.initPosition()
      },
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
                  real_name: model.real_name,
                  gender: model.gender,
                  email: model.email,
                  phone_number: model.phone_number,
                  address: model.address,
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
            console.log('%c[Member DetailDialog] Error: submit', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
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
              color: 'rgb(156, 163, 175)',
              text: '封鎖',
            }
          case 1:
            return {
              color: 'rgb(52, 211, 153)',
              text: '正常',
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
